"""
Live Data Store — Collects real-world route feedback and context data
for incremental model retraining.
"""

import json
import os
import time
from threading import Lock
from pathlib import Path

DATA_DIR = Path(__file__).parent / "live_data"
DATA_DIR.mkdir(exist_ok=True)

FEEDBACK_FILE = DATA_DIR / "route_feedback.json"
CONTEXT_LOG_FILE = DATA_DIR / "context_log.json"

_lock = Lock()


def _load_json(filepath: Path) -> list:
    if not filepath.exists():
        return []
    try:
        with open(filepath, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return []


def _save_json(filepath: Path, data: list):
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)


def store_route_feedback(feedback: dict):
    """
    Store feedback from a completed mission route.
    
    Expected feedback format:
    {
        "mission_id": str,
        "start": {"lat": float, "lng": float},
        "end": {"lat": float, "lng": float},
        "route_type": "fast" | "safe",
        "actual_travel_time_min": float,
        "predicted_travel_time_min": float,
        "road_conditions": {
            "flood_reports": int,
            "water_depth": float,
            "traffic_speed": float,
            "visibility": float,
            "blocked_segments": int,
            "crowd_density": float
        },
        "success": bool,  # Did the route work without issues?
        "rerouted": bool,  # Was a reroute needed?
        "timestamp": str (ISO)
    }
    """
    with _lock:
        data = _load_json(FEEDBACK_FILE)
        feedback["stored_at"] = time.time()
        data.append(feedback)
        _save_json(FEEDBACK_FILE, data)
    
    return len(data)


def store_context_snapshot(context: dict):
    """
    Store a live context snapshot from the system.
    
    Expected format:
    {
        "source": "emergency" | "vehicle" | "weather" | "manual",
        "location": {"lat": float, "lng": float},
        "data": {
            "elevation": float,
            "flood_reports": int,
            "traffic_speed": float,
            "water_depth": float,
            "road_width": float,
            "visibility": float,
            "crowd_density": float,
            "is_bridge": bool,
            "near_river": bool,
            "blocked": bool
        },
        "timestamp": str (ISO)
    }
    """
    with _lock:
        data = _load_json(CONTEXT_LOG_FILE)
        context["stored_at"] = time.time()
        data.append(context)

        # Keep only last 10000 entries to prevent unbounded growth
        if len(data) > 10000:
            data = data[-10000:]

        _save_json(CONTEXT_LOG_FILE, data)
    
    return len(data)


def get_feedback_count() -> int:
    return len(_load_json(FEEDBACK_FILE))


def get_context_count() -> int:
    return len(_load_json(CONTEXT_LOG_FILE))


def get_all_feedback() -> list:
    return _load_json(FEEDBACK_FILE)


def get_all_context() -> list:
    return _load_json(CONTEXT_LOG_FILE)


def clear_feedback():
    """Clear feedback after successful retraining."""
    with _lock:
        _save_json(FEEDBACK_FILE, [])


def get_training_stats() -> dict:
    feedback = _load_json(FEEDBACK_FILE)
    contexts = _load_json(CONTEXT_LOG_FILE)

    successful = [f for f in feedback if f.get("success")]
    failed = [f for f in feedback if not f.get("success")]
    rerouted = [f for f in feedback if f.get("rerouted")]

    return {
        "total_feedback": len(feedback),
        "total_context_snapshots": len(contexts),
        "successful_routes": len(successful),
        "failed_routes": len(failed),
        "rerouted_routes": len(rerouted),
        "avg_time_deviation": _avg_time_deviation(feedback),
        "ready_for_retrain": len(feedback) >= 50,
    }


def _avg_time_deviation(feedback: list) -> float:
    deviations = []
    for f in feedback:
        predicted = f.get("predicted_travel_time_min", 0)
        actual = f.get("actual_travel_time_min", 0)
        if predicted > 0:
            deviations.append(abs(actual - predicted) / predicted)
    
    if not deviations:
        return 0.0
    return round(sum(deviations) / len(deviations) * 100, 2)  # percentage
