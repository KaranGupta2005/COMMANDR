import json, random

def generate(n=8000):
    data = []

    for _ in range(n):
        rainfall = random.uniform(0, 150)           # mm
        flood_reports = random.randint(0, 15)
        traffic_speed = random.uniform(2, 60)
        elevation = random.uniform(180, 300)
        water_depth = random.uniform(0, 120)        # cm
        road_width = random.uniform(2.5, 12)        # meters
        visibility = random.uniform(0.2, 1.0)       # 0–1
        crowd_density = random.uniform(0, 1)
        is_bridge = random.randint(0, 1)
        near_river = random.randint(0, 1)
        blocked = random.choices([0,1],[0.9,0.1])[0]

        if blocked == 1:
            risk = 1.0
        else:
            risk = (
                0.25 * (rainfall / 150) +
                0.20 * (flood_reports / 15) +
                0.20 * (water_depth / 120) +
                0.15 * (1 - traffic_speed / 60) +
                0.10 * crowd_density +
                0.05 * (1 if is_bridge else 0) +
                0.05 * (1 if elevation < 220 else 0)
            )

        data.append({
            "length": random.uniform(50, 1000),
            "road_type": random.choice([0,1,2]),     # highway, main, local
            "elevation": elevation,
            "flood_reports": flood_reports,
            "traffic_speed": traffic_speed,
            "water_depth": water_depth,
            "road_width": road_width,
            "visibility": visibility,
            "crowd_density": crowd_density,
            "is_bridge": is_bridge,
            "near_river": near_river,
            "blocked": blocked,
            "risk_score": min(risk, 1)
        })

    with open("road_data.json", "w") as f:
        json.dump(data, f, indent=2)

generate()
print("Data generated")
