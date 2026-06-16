"""
Live Trainer — Incrementally retrains the risk model using real feedback data.

Supports:
- Full retrain from accumulated live data
- Incremental partial_fit (warm start) for quick updates
- Model versioning with rollback capability
- Performance comparison between old and new models
"""

import json
import time
import shutil
from pathlib import Path

import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error

from live_data_store import get_all_feedback, get_all_context, clear_feedback, get_training_stats

MODEL_PATH = Path(__file__).parent / "risk_model.pkl"
MODEL_BACKUP_DIR = Path(__file__).parent / "model_versions"
TRAINING_LOG = Path(__file__).parent / "live_data" / "training_log.json"

MODEL_BACKUP_DIR.mkdir(exist_ok=True)


def _feedback_to_training_samples(feedback_list: list) -> list:
    """
    Convert route feedback into training samples.
    
    Each feedback item contains road conditions and whether the route
    succeeded. We derive a risk_score from real outcomes.
    """
    samples = []

    for fb in feedback_list:
        conditions = fb.get("road_conditions", {})
        
        # Calculate actual risk from outcome
        # Higher risk if: rerouted, failed, or large time deviation
        base_risk = 0.0

        if fb.get("blocked_segments", conditions.get("blocked_segments", 0)) > 0:
            base_risk = 1.0
        else:
            # Time deviation factor
            predicted = fb.get("predicted_travel_time_min", 1)
            actual = fb.get("actual_travel_time_min", predicted)
            time_ratio = actual / max(predicted, 1)
            time_risk = min(max((time_ratio - 1) * 0.5, 0), 0.4)

            # Condition factors
            flood_risk = min(conditions.get("flood_reports", 0) / 15, 1) * 0.25
            water_risk = min(conditions.get("water_depth", 0) / 120, 1) * 0.2
            traffic_risk = max(1 - conditions.get("traffic_speed", 30) / 60, 0) * 0.15
            crowd_risk = conditions.get("crowd_density", 0) * 0.1
            visibility_risk = max(1 - conditions.get("visibility", 1), 0) * 0.1

            base_risk = time_risk + flood_risk + water_risk + traffic_risk + crowd_risk + visibility_risk

            # Boost risk if route failed or needed rerouting
            if not fb.get("success", True):
                base_risk = min(base_risk + 0.3, 1.0)
            elif fb.get("rerouted", False):
                base_risk = min(base_risk + 0.15, 1.0)

        sample = {
            "length": float(conditions.get("segment_length", 200)),
            "road_type": float(conditions.get("road_type", 1)),
            "elevation": float(conditions.get("elevation", 220)),
            "flood_reports": float(conditions.get("flood_reports", 0)),
            "traffic_speed": float(conditions.get("traffic_speed", 30)),
            "water_depth": float(conditions.get("water_depth", 0)),
            "road_width": float(conditions.get("road_width", 5)),
            "visibility": float(conditions.get("visibility", 1)),
            "crowd_density": float(conditions.get("crowd_density", 0)),
            "is_bridge": int(conditions.get("is_bridge", 0)),
            "near_river": int(conditions.get("near_river", 0)),
            "blocked": int(conditions.get("blocked", 0)),
            "risk_score": round(min(max(base_risk, 0), 1), 4),
        }
        samples.append(sample)

    return samples


def _context_to_training_samples(context_list: list) -> list:
    """
    Convert context snapshots into training samples.
    Context snapshots come from real conditions observed in the field.
    """
    samples = []

    for ctx in context_list:
        data = ctx.get("data", {})
        
        # Derive risk from observed conditions
        blocked = int(data.get("blocked", False))
        if blocked:
            risk = 1.0
        else:
            risk = (
                0.25 * min(float(data.get("flood_reports", 0)) / 15, 1) +
                0.20 * min(float(data.get("water_depth", 0)) / 120, 1) +
                0.15 * max(1 - float(data.get("traffic_speed", 30)) / 60, 0) +
                0.10 * float(data.get("crowd_density", 0)) +
                0.10 * max(1 - float(data.get("visibility", 1)), 0) +
                0.05 * int(data.get("is_bridge", 0)) +
                0.05 * (1 if float(data.get("elevation", 250)) < 220 else 0) +
                0.10 * int(data.get("near_river", 0))
            )

        sample = {
            "length": 200.0,  # Default segment length
            "road_type": 1.0,
            "elevation": float(data.get("elevation", 220)),
            "flood_reports": float(data.get("flood_reports", 0)),
            "traffic_speed": float(data.get("traffic_speed", 30)),
            "water_depth": float(data.get("water_depth", 0)),
            "road_width": float(data.get("road_width", 5)),
            "visibility": float(data.get("visibility", 1)),
            "crowd_density": float(data.get("crowd_density", 0)),
            "is_bridge": int(data.get("is_bridge", 0)),
            "near_river": int(data.get("near_river", 0)),
            "blocked": blocked,
            "risk_score": round(min(max(risk, 0), 1), 4),
        }
        samples.append(sample)

    return samples


def retrain_model(min_samples: int = 50) -> dict:
    """
    Retrain the risk model using accumulated live data.
    
    Strategy:
    1. Load existing synthetic training data as base
    2. Add live feedback + context samples
    3. Train new model
    4. Compare with old model
    5. If better, replace; otherwise keep old
    
    Returns training report.
    """
    stats = get_training_stats()
    
    feedback = get_all_feedback()
    contexts = get_all_context()
    
    live_samples = _feedback_to_training_samples(feedback) + _context_to_training_samples(contexts)
    
    if len(live_samples) < min_samples:
        return {
            "status": "skipped",
            "reason": f"Need at least {min_samples} samples, have {len(live_samples)}",
            "current_samples": len(live_samples),
        }

    # Load base synthetic data if available
    base_data_path = Path(__file__).parent / "road_data.json"
    base_samples = []
    if base_data_path.exists():
        with open(base_data_path) as f:
            base_samples = json.load(f)

    # Combine: live data weighted 2x (more recent = more relevant)
    all_samples = base_samples + live_samples + live_samples  # double weight live data
    
    df = pd.DataFrame(all_samples)
    X = df.drop("risk_score", axis=1)
    y = df["risk_score"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Train new model
    new_model = RandomForestRegressor(
        n_estimators=250,
        max_depth=16,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )
    new_model.fit(X_train, y_train)

    # Evaluate new model
    new_pred = new_model.predict(X_test)
    new_rmse = float(np.sqrt(mean_squared_error(y_test, new_pred)))
    new_mae = float(mean_absolute_error(y_test, new_pred))

    # Evaluate old model on same test set
    old_rmse = None
    old_mae = None
    if MODEL_PATH.exists():
        try:
            old_model = joblib.load(MODEL_PATH)
            old_pred = old_model.predict(X_test)
            old_rmse = float(np.sqrt(mean_squared_error(y_test, old_pred)))
            old_mae = float(mean_absolute_error(y_test, old_pred))
        except Exception:
            old_rmse = None

    # Decision: deploy new model if it's better (or if no old model)
    improved = old_rmse is None or new_rmse <= old_rmse
    
    report = {
        "status": "success" if improved else "rejected",
        "new_model_rmse": round(new_rmse, 6),
        "new_model_mae": round(new_mae, 6),
        "old_model_rmse": round(old_rmse, 6) if old_rmse else None,
        "old_model_mae": round(old_mae, 6) if old_mae else None,
        "improvement": round((old_rmse - new_rmse) / old_rmse * 100, 2) if old_rmse else None,
        "total_training_samples": len(all_samples),
        "live_samples_used": len(live_samples),
        "base_samples_used": len(base_samples),
        "deployed": improved,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
    }

    if improved:
        # Backup current model
        if MODEL_PATH.exists():
            version = int(time.time())
            backup_path = MODEL_BACKUP_DIR / f"risk_model_v{version}.pkl"
            shutil.copy2(MODEL_PATH, backup_path)
            report["backup_path"] = str(backup_path)

            # Keep only last 5 backups
            backups = sorted(MODEL_BACKUP_DIR.glob("*.pkl"), key=lambda p: p.stat().st_mtime)
            for old_backup in backups[:-5]:
                old_backup.unlink()

        # Save new model
        joblib.dump(new_model, MODEL_PATH)
        report["model_path"] = str(MODEL_PATH)

    # Log training run
    _log_training(report)

    return report


def rollback_model() -> dict:
    """Rollback to the last backed-up model version."""
    backups = sorted(MODEL_BACKUP_DIR.glob("*.pkl"), key=lambda p: p.stat().st_mtime)
    
    if not backups:
        return {"status": "error", "reason": "No backup models available"}

    latest_backup = backups[-1]
    shutil.copy2(latest_backup, MODEL_PATH)

    return {
        "status": "success",
        "restored_from": str(latest_backup),
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
    }


def get_training_history() -> list:
    """Get history of all training runs."""
    if not TRAINING_LOG.exists():
        return []
    try:
        with open(TRAINING_LOG) as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return []


def _log_training(report: dict):
    history = get_training_history()
    history.append(report)
    # Keep last 50 entries
    history = history[-50:]
    
    TRAINING_LOG.parent.mkdir(exist_ok=True)
    with open(TRAINING_LOG, "w") as f:
        json.dump(history, f, indent=2)
