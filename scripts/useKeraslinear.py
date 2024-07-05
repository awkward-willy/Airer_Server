import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '1'
os.environ["CUDA_VISIBLE_DEVICES"] = '0'
from sklearn.preprocessing import MinMaxScaler, RobustScaler, StandardScaler
from keras._tf_keras.keras.layers import Dropout
from keras._tf_keras.keras.layers import Dense
from keras._tf_keras.keras.models import Sequential
import joblib
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np


TRAIN_FILE_DIR = 'train/'
TEST_FILE_NAME = '0428.csv'
SLIDING_WINDOW = 10
scaler = MinMaxScaler()  # None, StandardScaler(), MinMaxScaler(), RobustScaler()
# 每分鐘資料量: 6
dataPointsPerMin = 6
DRYTIMEOFFSET = 45

X = np.array([])
temp = np.array([])
Y = np.array([])

# read every csv file in TRAIN_FILE_DIR
for files in os.listdir(TRAIN_FILE_DIR):
    data = pd.read_csv(TRAIN_FILE_DIR + files, header=None)
    if len(data.columns) == 8:
        label = ['Time', 'Humidity_Clo', 'TempC_Clo', 'TempF_Clo',
                 'Humidity_Sur', 'TempC_Sur', 'TempF_Sur', 'Weight']
        data.columns = label
        # Sliding window 計算乾燥時間
        for i in range(SLIDING_WINDOW, len(data)):
            if data['Weight'][i] < 50:
                continue
            y = data['Weight'][i-SLIDING_WINDOW:i]
            # mean slope
            slope = (y.iloc[-1] - y.iloc[0]) / SLIDING_WINDOW
            if abs(slope) < 0.01:
                dryTime = i
                break

    elif len(data.columns) == 10:
        label = ['Time', 'Humidity_Clo', 'TempC_Clo', 'TempF_Clo',
                 'Humidity_Sur', 'TempC_Sur', 'TempF_Sur', 'Weight', 'Wet_Sur', 'Wet_Clo']
        data.columns = label
        # Sliding window 計算乾燥時間
        for i in range(SLIDING_WINDOW, len(data)):
            if data['Weight'][i] < 50:
                continue
            if data['Wet_Clo'][i] <= 3 and i > 15:
                dryTime = i
                break

    dryTime += DRYTIMEOFFSET

    for i in range(SLIDING_WINDOW, len(data)):
        tenMinData = np.array([])
        for j in range(i-SLIDING_WINDOW, i):
            oneMinData = np.array([])
            oneMinData = np.append(oneMinData, data['Weight'][0])
            oneMinData = np.append(oneMinData, data['Humidity_Clo'][j])
            oneMinData = np.append(oneMinData, data['TempC_Clo'][j])
            oneMinData = np.append(oneMinData, data['Humidity_Sur'][j])
            oneMinData = np.append(oneMinData, data['TempC_Sur'][j])
            oneMinData = np.append(oneMinData, data['Weight'][j])
            tenMinData = np.append(tenMinData, oneMinData)
        if (i < dryTime):
            tenMinData = np.append(tenMinData, (dryTime - i))
        else:
            tenMinData = np.append(tenMinData, 0)
        temp = np.append(temp, tenMinData)
    temp = temp.reshape(-1, SLIDING_WINDOW*dataPointsPerMin+1)
    print(f'{files} done! Amount of data points: {len(temp)}, dryTime: {dryTime}')
    # # 移除Y 為 0 的資料至保留最多 60 筆
    numRemove = 0
    for i in range(len(temp)):
        if temp[i, -1] == 0:
            numRemove += 1
        else:
            break
    if numRemove > 60:
        numRemove = 60
    temp = temp[numRemove:]
    Y = np.append(Y, temp[:, -1])
    X = np.append(X, temp[:, :-1])
    X = X.reshape(-1, SLIDING_WINDOW*dataPointsPerMin)
    temp = np.array([])

# shuffle
index = np.arange(len(X))
np.random.shuffle(index)
X = X[index]
Y = Y[index]

# # 移除所有 Y 為 0 的資料
# X = X[Y != 0]
# Y = Y[Y != 0]

# 2. 資料前處理
# 資料攤平
train_data = X

# 用 MinMaxScaler 進行標準化
scaler = MinMaxScaler()
train_data = scaler.fit_transform(train_data)

train_labels = Y.reshape(-1, 1)

# 3. 建立模型
model = Sequential()
model.add(Dense(units=200, activation='relu',
          input_shape=(SLIDING_WINDOW*dataPointsPerMin,)))
model.add(Dropout(0.2))
model.add(Dense(units=200, activation='relu'))
model.add(Dense(units=200, activation='relu'))
model.add(Dropout(0.2))
model.add(Dense(units=200, activation='relu'))
model.add(Dense(units=200, activation='relu'))
model.add(Dropout(0.2))
model.add(Dense(units=100, activation='relu'))
model.add(Dense(units=1, activation='linear'))

model.compile(loss='mean_squared_error', optimizer='adam')

# 5. 訓練模型
model.fit(train_data, train_labels, epochs=100, batch_size=10)

# 輸出模型的摘要資訊
model.summary()

# 7. 預測
test_data = pd.read_csv(TEST_FILE_NAME, header=None)

if len(test_data.columns) == 8:
    label = ['Time', 'Humidity_Clo', 'TempC_Clo', 'TempF_Clo',
             'Humidity_Sur', 'TempC_Sur', 'TempF_Sur', 'Weight']
    test_data.columns = label
    # Sliding window 計算乾燥時間
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
    # Sliding window 計算乾燥時間
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

print(
    f'Test data, {files} done! Amount of data points: {len(X)}, dryTime: {dryTime}')

# 正規化
# X = X.astype('float32')
# # 每個 col 分別標準化
# for i in range(X.shape[1]):
#     X[:, i] = X[:, i] / X[:, i].max()

# 用 MinMaxScaler 進行標準化
X = scaler.transform(X)

# 移除所有 Y 為 0 的資料
# X = X[Y != 0]
# Y = Y[Y != 0]

# 7. 預測
predictions = model.predict(X)

# 8. 評估
score = model.evaluate(X, Y)

# # 儲存模型
model.save('model.keras')

# scalar dump
scaler_filename = "scaler.save"
joblib.dump(scaler, scaler_filename)

# 計算最大誤差時間
maxError = 0
for i in range(len(Y)):
    if abs(Y[i] - predictions[i]) > maxError:
        maxError = abs(Y[i] - predictions[i])
print(f'Max Error: {maxError}')

# 計算差值在 30 分鐘以內的準確率
correct = 0
for i in range(len(Y)):
    if abs(Y[i] - predictions[i]) < 30:
        correct += 1
print(f'Accuracy: {correct/len(Y)*100}%')

# 畫圖
plt.figure()
plt.plot(Y, label='Truth Value')
plt.plot(predictions, label='Model Prediction')
plt.title("Validation Data Prediction")
plt.legend()
# 儲存圖片
plt.savefig('test.png')
