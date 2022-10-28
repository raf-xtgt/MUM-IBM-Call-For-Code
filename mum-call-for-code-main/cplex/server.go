package main

import (
	"encoding/json"
	"io"
	"net/http"
	"sync"

	"github.com/gorilla/mux"
)

var mutex = &sync.Mutex{}

func makeMuxRouter() http.Handler {
	muxRouter := mux.NewRouter()
	muxRouter.HandleFunc("/", handleGetBlockchain).Methods("GET")
	//muxRouter.HandleFunc("/WriteBlock", handleWriteBlock)
	muxRouter.HandleFunc("/print", Validate)
	muxRouter.HandleFunc("/AddUser", Adduser)
	muxRouter.HandleFunc("/AddLeader", AddLeader)
	muxRouter.HandleFunc("/SendSomething", ValidateBlockchain)

	muxRouter.HandleFunc("/InitCM", initializeCM)

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

	Verified, newBlock := RunCustomerMatching()
	// Function to get the timeslot for every 30 minutes
	//timeslot := time.Now().Hour()*2 + time.Now().Minute()/30
	//fmt.Println(timeslot)

	for !Verified {
		// If the solution is not optimal, find the responsible leader
		for i := 0; i < len(UserProfiles); i++ {
			if UserProfiles[i].UserID == newBlock.LeaderID {
				// Cannot create a block anymore
				UserProfiles[i].Type = "Dishonest Leader"
			}
		}
		// Run the customer matching algorithm again
		Verified, newBlock = RunCustomerMatching()
	}
	// Append the new block to the current blockchain
	Blockchain = append(Blockchain, newBlock)
	// Write central and local blockchain
	writejson()
	writeLocalBlockchain(Blockchain)
	// Empty the current list of request
	var EmptyRequestList []BuySellRequest
	AllRequest = EmptyRequestList
}

func Adduser(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT")
	createUser("SH", "Clerk")
}

func AddLeader(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT")
	createUser("CS", "Leader")
}

func ValidateBlockchain(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT")

	checkBlockchainValid()
}

// Create a transaction data block from the HTTP POST request
/* func handleWriteBlock(w http.ResponseWriter, r *http.Request) {
	var data2 BuySellRequest

	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT")
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&data2); err != nil {
		respondWithJSON(w, r, http.StatusBadRequest, r.Body)
		fmt.Println(err)
		return
	}
	defer r.Body.Close()

	//ensure atomicity when creating new block
	mutex.Lock()
	AllReq = append(AllReq, data2)
	spew.Dump(AllReq)
	mutex.Unlock()

} */

// Obtain from mycoralhealth website, simply return the HTTP status and data to the front end
func respondWithJSON(w http.ResponseWriter, r *http.Request, code int, payload interface{}) {
	response, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("HTTP 500: Internal Server Error"))
		return
	}
	w.WriteHeader(code)
	w.Write(response)
}
