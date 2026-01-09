import osmnx as ox
import matplotlib.pyplot as plt

def plot(G, fast, safe):
    fig, ax = ox.plot_graph_routes(
        G,
        routes=[fast, safe],
        route_colors=["green", "red"],
        route_linewidth=4,
        node_size=0
    )
