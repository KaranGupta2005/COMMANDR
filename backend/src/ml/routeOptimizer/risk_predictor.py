import os
import joblib
import pandas as pd

MODEL_PATH = "risk_model.pkl"
risk_model = joblib.load(MODEL_PATH)

ROAD_TYPE_MAP = {
    "motorway": 5,
    "trunk": 4,
    "primary": 3,
    "secondary": 2,
    "tertiary": 1.5,
    "residential": 1,
    "service": 0.5,
}

def predict_edge_risk(edge, context):
    highway = edge.get("highway", "residential")

    # highway kabhi list hota hai
    if isinstance(highway, list):
        highway = highway[0]

    features = {
        "length": float(edge.get("length", 100)),
        "road_type": ROAD_TYPE_MAP.get(highway, 1),
        "elevation": float(context.get("elevation", 0)),
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
    return float(risk_model.predict(X)[0])
