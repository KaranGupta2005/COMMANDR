from risk_predictor import predict_edge_risk

def attach_risk_weights(G, context):
    for u, v, k, data in G.edges(keys=True, data=True):
        risk = predict_edge_risk(data, context)

        length = data.get("length", 1)

        if context.get("blocked", False):
            data["risk_weight"] = length * 1000
        else:
            data["risk_weight"] = length * (1 + 3 * risk)

        data["risk_score"] = risk

    print("Risk weights attached")
    return G
