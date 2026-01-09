import random

def get_live_context():
    return {
        "elevation": random.uniform(180, 300),
        "flood_reports": random.randint(0, 15),
        "traffic_speed": random.uniform(5, 60),
        "water_depth": random.uniform(0, 120),
        "road_width": random.uniform(3, 12),
        "visibility": random.uniform(0.2, 1),
        "crowd_density": random.uniform(0, 1),
        "is_bridge": random.randint(0, 1),
        "near_river": random.randint(0, 1),
        "blocked": random.choices([0, 1], [0.9, 0.1])[0],
    }
