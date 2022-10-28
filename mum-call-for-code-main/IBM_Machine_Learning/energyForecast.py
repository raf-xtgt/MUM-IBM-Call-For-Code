from ibm_watson_machine_learning import APIClient
import numpy as np
import pandas
import matplotlib.pyplot as plt

# Connecting the device to IBM Cloud
wml_credentials = {
    "apikey": "GMIypvOjDD4iBW4Mb2Mt91DSBB3Bjv5-SRMNyocxWIq-",
    "url": "https://eu-gb.ml.cloud.ibm.com"
}

wml_client = APIClient(wml_credentials)

wml_client.spaces.list()

SPACE_ID = "9575ddbd-d3ba-4024-b54b-5722381a1c27"
wml_client.set.default_space(SPACE_ID)

# read the data
path = "./Irradiance_data_for_one_day.xlsx"
dataframe = pandas.read_excel(path,usecols=[3,4])
dataset = dataframe.values
dataset = dataset.astype('float32')

# 34 is the timestep
train, test = dataset[0:34,0], dataset[0:34,1]
def create_dataset(dataset, look_back=1):
	dataX, dataY = [], []
	for i in range(len(dataset)-look_back-1):
		a = dataset[i:(i+look_back)]
		dataX.append(a)
		dataY.append(dataset[i + look_back])
	return np.array(dataX), np.array(dataY)

# reshape into X=t and Y=t+1
look_back = 1
trainX, trainY = create_dataset(train, look_back)
testX, testY = create_dataset(test, look_back)

trainX = np.reshape(trainX, (trainX.shape[0], 1, 1))
testX = np.reshape(testX, (testX.shape[0], 1, 1))

# this LSTM can run any size/length of data
DiffSizeX = [1.0,2.0,3.0]
DiffSizeX = np.array(DiffSizeX)
DiffSizeX = np.reshape(DiffSizeX, (DiffSizeX.shape[0],1,1))

# can change testX to other var
payload = {
    'input_data':[
        {"values":testX}
    ]
}
deployment_uid = '34381958-c550-4adf-beba-997a5ecb71c0'

# This is the line that runs the prediction
result = wml_client.deployments.score(deployment_uid,payload)

# Extract the predicted values
pred_values = np.squeeze(result['predictions'][0]['values'])
print(pred_values)
# print(pred_values) check whether it runs correctly
plt.plot(np.linspace(0,len(pred_values),len(pred_values)),pred_values[:,0])
plt.plot(np.linspace(0,len(testY),len(testY)),testY)