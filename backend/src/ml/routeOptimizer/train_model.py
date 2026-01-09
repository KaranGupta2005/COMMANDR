import pandas as pd
import json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
import joblib
import numpy as np

with open("road_data.json") as f:
    data = json.load(f)

df = pd.DataFrame(data)

X = df.drop("risk_score", axis=1)
y = df["risk_score"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestRegressor(
    n_estimators=200,
    max_depth=14,
    min_samples_split=5,
    random_state=42
)

model.fit(X_train, y_train)

pred = model.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, pred))
print("RMSE:", rmse)

joblib.dump(model, "risk_model.pkl")
print("Model saved")
