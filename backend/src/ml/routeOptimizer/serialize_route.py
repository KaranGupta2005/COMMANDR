def serialize_route(G, route):
    coords = []
    for node in route:
        coords.append({
            "lat": G.nodes[node]["y"],
            "lng": G.nodes[node]["x"]
        })
    return coords
