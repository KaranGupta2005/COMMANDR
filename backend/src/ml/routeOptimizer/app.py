from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import Optional
from run_route_engine import compute_safe_and_fast
from serialize_route import serialize_route
from live_data_store import (
    store_route_feedback,
    store_context_snapshot,
    get_training_stats,
    get_feedback_count,
    get_context_count,
)
from live_trainer import retrain_model, rollback_model, get_training_history

app = FastAPI(title="COMMANDR Route Optimizer", version="2.0.0")


# ==================== ROUTE OPTIMIZATION ====================

class RouteRequest(BaseModel):
    start_lat: float
    start_lng: float
    end_lat: float
    end_lng: float
    context: dict


@app.post("/optimize-route")
def optimize_route(req: RouteRequest):
    """Compute fast and safe routes using ML risk prediction."""
    fast, safe, G = compute_safe_and_fast(
        start=(req.start_lat, req.start_lng),
        end=(req.end_lat, req.end_lng),
        context=req.context,
    )

    return {
        "fast_route": serialize_route(G, fast),
        "safe_route": serialize_route(G, safe),
    }


# ==================== LIVE DATA INGESTION ====================

class RouteFeedback(BaseModel):
    mission_id: str
    start: dict  # {lat, lng}
    end: dict  # {lat, lng}
    route_type: str  # "fast" or "safe"
    actual_travel_time_min: float
    predicted_travel_time_min: float
    road_conditions: dict
    success: bool
    rerouted: bool = False
    timestamp: Optional[str] = None


class ContextSnapshot(BaseModel):
    source: str  # "emergency", "vehicle", "weather", "manual"
    location: dict  # {lat, lng}
    data: dict  # road condition features
    timestamp: Optional[str] = None


@app.post("/feedback")
def submit_feedback(fb: RouteFeedback):
    """
    Submit route feedback after a mission completes.
    Used for retraining the risk model with real outcomes.
    """
    count = store_route_feedback(fb.model_dump())
    return {
        "status": "stored",
        "total_feedback": count,
        "message": "Feedback recorded for model improvement",
    }


@app.post("/context")
def submit_context(ctx: ContextSnapshot):
    """
    Submit live context data (flood reports, traffic, weather).
    Collected from emergencies, vehicles, and field observations.
    """
    count = store_context_snapshot(ctx.model_dump())
    return {
        "status": "stored",
        "total_context_snapshots": count,
    }


# ==================== MODEL TRAINING ====================

@app.post("/train")
def trigger_training(background_tasks: BackgroundTasks, min_samples: int = 50):
    """
    Trigger model retraining with accumulated live data.
    Runs in the background if sufficient data is available.
    """
    stats = get_training_stats()

    if not stats["ready_for_retrain"] and get_feedback_count() + get_context_count() < min_samples:
        return {
            "status": "skipped",
            "reason": f"Need {min_samples} samples, have {get_feedback_count() + get_context_count()}",
            "stats": stats,
        }

    # Run training (synchronous for now — fast enough with <10k samples)
    report = retrain_model(min_samples=min_samples)
    return report


@app.post("/rollback")
def trigger_rollback():
    """Rollback to previous model version if new model performs poorly."""
    result = rollback_model()
    if result["status"] == "error":
        raise HTTPException(status_code=404, detail=result["reason"])
    return result


# ==================== MONITORING ====================

@app.get("/stats")
def get_stats():
    """Get training stats and model health."""
    return get_training_stats()


@app.get("/training-history")
def training_history():
    """Get history of all training runs with metrics."""
    return get_training_history()


@app.get("/health")
def health():
    """Health check."""
    return {
        "status": "ok",
        "model": "risk_model.pkl",
        "feedback_count": get_feedback_count(),
        "context_count": get_context_count(),
    }
