package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"strconv"
)

// Just create some random request to be written into request.json
func createRequest() {
	CreateEVBuyRequest()
	CreateEVBuyRequest()
	CreateEVSellRequest()
	CreateSmartHomeBuyRequest()
	CreateSmartHomeBuyRequest()
	CreateSmartHomeSellRequest()
	fmt.Println("All requests size", len(AllRequest))
	for i := 0; i < len(AllRequest); i++ {
		fmt.Println(AllRequest[i])
	}

}
func CreateSmartHomeBuyRequest() {
	var NewRequest BuySellRequest

	NewRequest.BidID = "BD " + strconv.Itoa(len(AllRequest)+1)
	NewRequest.UserID = "SH " + strconv.Itoa(rand.Intn(10-1)+1)
	NewRequest.UserEnergy = randFloats(30.0, 60.0)
	NewRequest.UserPrice = randFloats(0.2, 0.5)
	NewRequest.Buyer_or_Seller = "Buy"
	NewRequest.Prosumer_or_EV = "SH"

	AllRequest = append(AllRequest, NewRequest)
}

func initializeCM(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Inside buy energy request")
	var newRequest []BuySellRequest

	//w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT")

	// get the data from json body
	decoder := json.NewDecoder(r.Body)
	// place the user data inside newRequest
	if err := decoder.Decode(&newRequest); err != nil {
		fmt.Println("Failed adding a new request", err)
		respondWithJSON(w, r, http.StatusBadRequest, r.Body)
		return
	}
	//fmt.Println("Data from frontend", &newRequest)
	AllRequest = newRequest
	//fmt.Println("All requests size", len(AllRequest))
	for i := 0; i < len(AllRequest); i++ {
		fmt.Println(AllRequest[i])
	}
	defer r.Body.Close()

	// run the rest
	//fmt.Println("Running Customer Matching")
	RunCustomerMatching()
	//fmt.Println("Customer Matching Output")

	newBlock := createBlock()
	fmt.Println(newBlock) // print the new block
	flag := VerifyOptimality(newBlock)
	fmt.Println(flag)
	newBlockchain := readGlobalBlockchain(newBlock)
	writeGlobalBlockchain(newBlockchain)

	respondWithJSON(w, r, http.StatusCreated, newBlockchain)

}

// read the blocks from the local blockchain
func readGlobalBlockchain(newBlock Block) []Block {
	filepath := "./globalBlockchain.json"
	file, _ := ioutil.ReadFile(filepath)

	localBlockchain := []Block{}

	_ = json.Unmarshal([]byte(file), &localBlockchain)

	localBlockchain = append(localBlockchain, newBlock)

	//fmt.Println("Local blockchain as read", localBlockchain)
	return localBlockchain

}

func writeGlobalBlockchain(data []Block) {
	file, _ := json.MarshalIndent(data, "", " ")

	_ = ioutil.WriteFile("./globalBlockchain.json", file, 0644)
	fmt.Println("Blockchain is now up to date")
}

func CreateEVBuyRequest() {
	var NewRequest BuySellRequest

	NewRequest.BidID = "BD " + strconv.Itoa(len(AllRequest)+1)
	NewRequest.UserID = "CS " + strconv.Itoa(rand.Intn(2-1)+1)
	NewRequest.UserEnergy = randFloats(0, 5)
	NewRequest.UserPrice = randFloats(0.2, 0.5)
	NewRequest.Buyer_or_Seller = "Buy"
	NewRequest.Prosumer_or_EV = "EV"

	AllRequest = append(AllRequest, NewRequest)
}

func CreateSmartHomeSellRequest() {

	var NewRequest BuySellRequest

	NewRequest.BidID = "BD " + strconv.Itoa(len(AllRequest)+1)
	NewRequest.UserID = "SH " + strconv.Itoa(rand.Intn(10-1)+1)
	NewRequest.UserEnergy = 0.0
	NewRequest.UserPrice = randFloats(0.2, 0.5)
	NewRequest.Buyer_or_Seller = "Sell"
	NewRequest.Prosumer_or_EV = "SH"

	AllRequest = append(AllRequest, NewRequest)
}

func CreateEVSellRequest() {
	var NewRequest BuySellRequest

	NewRequest.BidID = "BD " + strconv.Itoa(len(AllRequest)+1)
	NewRequest.UserID = "CS " + strconv.Itoa(rand.Intn(10-1)+1)
	NewRequest.UserEnergy = randFloats(0, 5)
	NewRequest.UserPrice = randFloats(0.2, 0.5)
	NewRequest.Buyer_or_Seller = "Sell"
	NewRequest.Prosumer_or_EV = "EV"

	AllRequest = append(AllRequest, NewRequest)
}

func randFloats(min, max float64) float64 {
	res := min + rand.Float64()*(max-min)
	return res
}
