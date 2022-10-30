# TransXEnergy



## About the project
Malaysia's growing population has led to a surging energy demand, necessitating an efficient smart grid. Electric vehicles (EVs) and smart homes with solar panels are two popular methods to support the operation of the smart grid. Currently however, there are few incentives for EV and smart home owners to perform energy transactions via the Vehicle-to-Grid network. The lack of incentives discourages the public from participating, which would reduce the efficiency of the smart grid and its environmental impact. Our solution is an auction-based peer-to-peer energy trading platform that uses blockchain technology.


### Solution Long Description (500 words)
Malaysia’s energy demand has surged with the growth of its population. Upgrading its mostly traditional power grid to keep up with demand is however very costly. Installing distributed energy resources in existing infrastructure (e.g., implementing solar photovoltaic (PV) generation in smart homes and buildings) has been identified as a cheaper and more environmentally friendly alternative. A net metering scheme was introduced to incentivise the adoption of solar PV in Malaysia by allowing excess generated energy to be sold back to the grid. The amount of energy purchased by the grid operator is however limited by annual quotas, which discourages smart homeowners from installing solar PVs due to diminished financial returns.
On the other hand, electric vehicles (EVs) have become increasingly common, and their large batteries and mobility have given rise to the vehicle-to-grid (V2G) concept, where a fleet of EVs are coordinated to deliver energy within a network. V2G has however received minimal attention due to various challenges involved in constructing a system to coordinate EVs to their destinations. The system would need to allow energy traders to post and view prices, match energy buyers with sellers quickly and efficiently, and consider EV battery charging cycles as well as energy production and consumption forecasts, while remaining secure and transparent across a peer-to-peer (P2P) network. To the best of our knowledge, no such network has been implemented in the Malaysian market. Furthermore, blockchains are widely used for securing transactions across distributed networks, but they commonly rely on the Proof-of-Work (PoW) algorithm. The PoW algorithm is very power-intensive, which runs contrary to the sustainable goals of the P2P energy transmission scheme.
Hence in line with the Call for Codes Challenge, we propose a P2P energy trading platform specifically targeting smart home energy producer/consumers (prosumers). An effective pricing scheme for prosumers and EV charging stations in the Malaysian market is designed using motivation game theory. The online platform would allow energy traders to directly post their buy/sell prices and view their expected returns for each transaction. Buyers are then matched with their respective sellers using a matching algorithm, which we implement as a Nash bargaining game to maximise profits for both sides of the transaction. These transactions are then recorded securely across the network in a blockchain which utilises a novel Proof-of-Solution consensus mechanism The proposed Proof-of-Solution mechanism has requires much less energy compared to the PoW algorithms, thus minimising the energy consumption in securing the blockchain, and yielding a more sustainable yet secure scheme.
Aside from the above scheme which would be facilitated in the backend, we aim to develop a web app for prosumers and EV charging stations to participate in the day-ahead P2P energy market. A separate app would also be developed for EV owners to allow their vehicle to easily pair with charging stations using NFC, as well as monitor their P2P transactions and EV battery charge status.


## Pre-requisites

### Clone the repp

```
git clone https://gitlab.com/ibm_cfc_mum/mum-ibm-call-for-code.git
```

### Install Node.js Package Manager
```
npm install
```



### Repo Structure

#### Web Application

Access the directory for web app
```
cd mum-ibm-call-for-code/mum-call-for-code-main/webApp
```
Please refer to the README.md file inside the webApp folder to run the web application


#### Mobile Application

Access the directory for mobile app
```
cd mum-ibm-call-for-code/mum-call-for-code-main/mobile_app
```
Please refer to the README.md file inside the directory mentioned above to run the mobile application


#### Cplex

Access the directory for cplex
```
cd mum-ibm-call-for-code/mum-call-for-code-main/cplex
```
Please refer to the README.md file inside the directory mentioned above to cplex code

#### Grafana
Access the directory for accessing the Grafana dashboard
```
cd mum-ibm-call-for-code/mum-call-for-code-nodered-grafana
```





