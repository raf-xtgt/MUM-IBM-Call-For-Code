package main

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/davecgh/go-spew/spew"
	"github.com/gorilla/mux"
)

//var mutex = &sync.Mutex{}

func makeMuxRouter() http.Handler {
	muxRouter := mux.NewRouter()
	muxRouter.HandleFunc("/", handleGetBlockchain).Methods("GET")
	//muxRouter.HandleFunc("/WriteBlock", handleWriteBlock)
	muxRouter.HandleFunc("/print", Validate)
	return muxRouter
}

// Obtain from mycoralhealth website
func handleGetBlockchain(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT")
	bytes, err := json.MarshalIndent(Blockchain, "", "  ")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	io.WriteString(w, string(bytes))
}

// Generate a Block from list of Transaction Data and send it to the other validators
func Validate(w http.ResponseWriter, r *http.Request) {

	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT")

	runCustomerMatchingAlgorithm()
	// timeslot and numUser is hardcoded for now, numUser = number of smarthome user we have
	timeslot := 21
	numUser := 7
	newBlock := createBlock(numUser, timeslot)
	Verified := VerifyOptimality(newBlock)
	if Verified {
		Blockchain = append(Blockchain, newBlock)
	}
	spew.Dump(Blockchain)

}

// Create a transaction data block from the HTTP POST request
/* func handleWriteBlock(w http.ResponseWriter, r *http.Request) {
	var data2 AltTransactionData
	var newTransactionData TransactionData

	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT")
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&data2); err != nil {
		respondWithJSON(w, r, http.StatusBadRequest, r.Body)
		return
	}
	defer r.Body.Close()

	//ensure atomicity when creating new block
	mutex.Lock()
	newTransactionData.Buyer, _ = strconv.Atoi(data2.Buyer)
	newTransactionData.Seller, _ = strconv.Atoi(data2.Seller)
	newTransactionData.Money, _ = strconv.Atoi(data2.Money)
	newTransactionData.Energy, _ = strconv.Atoi(data2.Energy)
	t := time.Now()
	newTransactionData.Timestamp = t.String()

	// Validate the Transaction data
	TxValidity := validateTransaction(newTransactionData)
	if TxValidity {
		newPending := append(pending, newTransactionData)
		pending = newPending
	} else {
		fmt.Println("Transaction error")
	}
	mutex.Unlock()

} */

// Obtain from mycoralhealth website, simply return the HTTP status and data to the front end
/* func respondWithJSON(w http.ResponseWriter, r *http.Request, code int, payload interface{}) {
	response, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("HTTP 500: Internal Server Error"))
		return
	}
	w.WriteHeader(code)
	w.Write(response)
} */
