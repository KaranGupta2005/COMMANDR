from build_graph import G
from route_engine import compute_routes

def compute_safe_and_fast(start, end, context):
    fast, safe = compute_routes(G, start, end, context)
    return fast, safe, G
