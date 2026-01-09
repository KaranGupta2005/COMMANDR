from fastapi import FastAPI
from pydantic import BaseModel
from run_route_engine import compute_safe_and_fast
from serialize_route import serialize_route

app = FastAPI()

class RouteRequest(BaseModel):
    start_lat: float
    start_lng: float
    end_lat: float
    end_lng: float
    context: dict   

@app.post("/optimize-route")
def optimize_route(req: RouteRequest):
    fast, safe, G = compute_safe_and_fast(
        start=(req.start_lat, req.start_lng),
        end=(req.end_lat, req.end_lng),
        context=req.context
    )

    return {
        "fast_route": serialize_route(G, fast),
        "safe_route": serialize_route(G, safe)
    }
