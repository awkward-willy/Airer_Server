import random
import joblib
import numpy as np
import keras._tf_keras.keras.saving
from flask import Flask, request, jsonify
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '5'

app = Flask(__name__)

model = keras.saving.load_model("model.keras")

scaler = joblib.load("scaler.save")


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    try:
        temperature_sur = data["temperature_sur"]
        temperature_clothes = data["temperature_clothes"]
        humidity_sur = data["humidity_sur"]
        humidity_clothes = data["humidity_clothes"]
        weight = data["weight"]
        initWeight = data["initWeight"]
        initWeight = [initWeight]
        initWeight = initWeight * 10
        data = np.array([])
        for i in range(10):
            data = np.append(data, initWeight[i])
            data = np.append(data, humidity_clothes[i])
            data = np.append(data, temperature_clothes[i])
            data = np.append(data, humidity_sur[i])
            data = np.append(data, temperature_sur[i])
            data = np.append(data, weight[i])
        data = [data]
        data = scaler.transform(data)
        prediction = model.predict(data, verbose=0)
        if(prediction[0][0] < 0):
            prediction[0][0] = 0
    except Exception as e:
        print(e)
        return jsonify({"error": "Invalid data"})

    if weight[0] < 250:
      json_obj = {}
      if float(prediction[0][0]) < 5:
        json_obj["prediction"] = float(prediction[0][0])
      else:
        json_obj["prediction"] = 1
      return jsonify(json_obj)

    json_obj = {}

    json_obj["prediction"] = float(prediction[0][0]) + 286

    return jsonify(json_obj)


if __name__ == '__main__':
    app.run()
