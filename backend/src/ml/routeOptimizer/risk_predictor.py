"""
Risk Predictor — Predicts road segment risk using the ML model.
Supports hot-reloading when the model is retrained.
"""

import os
import time
import joblib
import pandas as pd
from pathlib import Path

MODEL_PATH = Path(__file__).parent / "risk_model.pkl"

# Model state
_model = None
_model_loaded_at = 0
_model_mtime = 0

ROAD_TYPE_MAP = {
    "motorway": 5,
    "trunk": 4,
    "primary": 3,
    "secondary": 2,
    "tertiary": 1.5,
    "residential": 1,
    "service": 0.5,
}


def _load_model():
    """Load or hot-reload the model if it has been updated on disk."""
    global _model, _model_loaded_at, _model_mtime

    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

    current_mtime = MODEL_PATH.stat().st_mtime

    # Reload if model file changed or not loaded yet
    if _model is None or current_mtime != _model_mtime:
        _model = joblib.load(MODEL_PATH)
        _model_mtime = current_mtime
        _model_loaded_at = time.time()
        print(f"🧠 Model loaded/reloaded (mtime: {current_mtime:.0f})")

    return _model


def predict_edge_risk(edge: dict, context: dict) -> float:
    """
    Predict risk score for a road edge given current context.
    
    Args:
        edge: Road segment data from OSMnx graph (highway, length, etc.)
        context: Live conditions (flood_reports, water_depth, etc.)
    
    Returns:
        Risk score between 0.0 (safe) and 1.0 (dangerous)
    """
    model = _load_model()

    highway = edge.get("highway", "residential")
    if isinstance(highway, list):
        highway = highway[0]

    features = {
        "length": float(edge.get("length", 100)),
        "road_type": ROAD_TYPE_MAP.get(highway, 1),
        "elevation": float(context.get("elevation", 220)),
        "flood_reports": float(context.get("flood_reports", 0)),
        "traffic_speed": float(context.get("traffic_speed", 30)),
        "water_depth": float(context.get("water_depth", 0)),
        "road_width": float(context.get("road_width", 5)),
        "visibility": float(context.get("visibility", 1)),
        "crowd_density": float(context.get("crowd_density", 0)),
        "is_bridge": int(context.get("is_bridge", False)),
        "near_river": int(context.get("near_river", False)),
        "blocked": int(context.get("blocked", False)),
    }

    X = pd.DataFrame([features])
    prediction = float(model.predict(X)[0])

    # Clamp to [0, 1]
    return max(0.0, min(1.0, prediction))


def get_model_info() -> dict:
    """Get info about the currently loaded model."""
    return {
        "path": str(MODEL_PATH),
        "exists": MODEL_PATH.exists(),
        "last_modified": _model_mtime,
        "loaded_at": _model_loaded_at,
        "model_type": type(_model).__name__ if _model else None,
    }
