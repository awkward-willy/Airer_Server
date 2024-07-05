import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '1'
os.environ["CUDA_VISIBLE_DEVICES"] = '0'
import joblib
import numpy as np
import pandas as pd
import keras._tf_keras.keras.saving

TEST_FILE_NAME = '0428.csv'
SLIDING_WINDOW = 10
dataPointsPerMin = 6

test_data = pd.read_csv(TEST_FILE_NAME, header=None)

if len(test_data.columns) == 8:
    label = ['Time', 'Humidity_Clo', 'TempC_Clo', 'TempF_Clo',
             'Humidity_Sur', 'TempC_Sur', 'TempF_Sur', 'Weight']
    test_data.columns = label
    for i in range(SLIDING_WINDOW, len(test_data)):
        if test_data['Weight'][i] < 50:
            continue
        y = test_data['Weight'][i-SLIDING_WINDOW:i]
        # mean slope
        slope = (y.iloc[-1] - y.iloc[0]) / SLIDING_WINDOW
        if abs(slope) < 0.01:
            dryTime = i
            break
elif len(test_data.columns) == 10:
    label = ['Time', 'Humidity_Clo', 'TempC_Clo', 'TempF_Clo',
             'Humidity_Sur', 'TempC_Sur', 'TempF_Sur', 'Weight', 'Wet_Sur', 'Wet_Clo']
    test_data.columns = label
    for i in range(SLIDING_WINDOW, len(test_data)):
        if test_data['Weight'][i] < 50:
            continue
        if test_data['Wet_Clo'][i] <= 3 and i > 15:
            dryTime = i
            break

X = np.array([])
for i in range(SLIDING_WINDOW, len(test_data)):
    tenMinData = np.array([])
    for j in range(i-SLIDING_WINDOW, i):
        oneMinData = np.array([])
        oneMinData = np.append(oneMinData, test_data['Weight'][0])
        oneMinData = np.append(oneMinData, test_data['Humidity_Clo'][j])
        oneMinData = np.append(oneMinData, test_data['TempC_Clo'][j])
        oneMinData = np.append(oneMinData, test_data['Humidity_Sur'][j])
        oneMinData = np.append(oneMinData, test_data['TempC_Sur'][j])
        oneMinData = np.append(oneMinData, test_data['Weight'][j])
        tenMinData = np.append(tenMinData, oneMinData)
    if (i < dryTime):
        tenMinData = np.append(tenMinData, (dryTime - i))
    else:
        tenMinData = np.append(tenMinData, 0)
    X = np.append(X, tenMinData)
X = X.reshape(-1, SLIDING_WINDOW*dataPointsPerMin+1)
Y = X[:, -1]
X = X[:, :-1]


scaler = joblib.load("scaler.save")

X = scaler.transform(X)

model = keras.saving.load_model("model.keras")

predictions = model.predict(X, verbose=0)

print(predictions[0][0])

maxError = 0
for i in range(len(Y)):
    if abs(Y[i] - predictions[i]) > maxError:
        maxError = abs(Y[i] - predictions[i])
print(f'Max Error: {maxError}')

correct = 0
for i in range(len(Y)):
    if abs(Y[i] - predictions[i]) < 45:
        correct += 1
print(f'Accuracy: {correct/len(Y)*100}%')
