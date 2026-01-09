import networkx as nx
import osmnx as ox

def compute_routes(G, start, end, context):
    start_lat, start_lng = start
    end_lat, end_lng = end

    # 🔑 Convert coordinates to graph node IDs
    start_node = ox.distance.nearest_nodes(G, start_lng, start_lat)
    end_node = ox.distance.nearest_nodes(G, end_lng, end_lat)

    # Fast route (shortest distance)
    fast_path = nx.shortest_path(
        G,
        start_node,
        end_node,
        weight="length"
    )

    # Safe route (ML-based weight)
    def safe_weight(u, v, data):
        from risk_predictor import predict_edge_risk
        risk = predict_edge_risk(data, context)
        return data.get("length", 1) * (1 + 3 * risk)

    safe_path = nx.shortest_path(
        G,
        start_node,
        end_node,
        weight=safe_weight
    )

    return fast_path, safe_path
