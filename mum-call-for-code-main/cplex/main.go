package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
)

func run() error {
	mux := makeMuxRouter()
	httpAddr := os.Getenv("PORT")
	log.Println("Listening on ", os.Getenv("PORT"))
	fmt.Println("Listening on ", os.Getenv("PORT"))

	s := &http.Server{
		Addr:           ":" + httpAddr,
		Handler:        mux,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	if err := s.ListenAndServe(); err != nil {
		return err
	}

	return nil
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}
	readjson()
	readUserjson()
	// RunNash()
	// RunBiddingRange()

	go func() {
		if Blockchain == nil {
			genesisBlock := createGenesisBlock()
			Blockchain = append(Blockchain, genesisBlock)
		}
	}()
	createUser("SH ", "Leader")
	// createRequest()
	// RunCustomerMatching()
	// newBlock := createBlock()
	// fmt.Println(newBlock)
	// //spew.Dump(newBlock) // print the new block
	// flag := VerifyOptimality(newBlock)
	// fmt.Println(flag)
	log.Fatal(run())
}

// Can ignore this when implement Mongo DB
// Read Blockchain from blockchain.json
func readjson() {
	jsonFile, err := os.Open("blockchain.json")
	if err != nil {
		log.Fatal(err)
	}
	byteValue, _ := ioutil.ReadAll(jsonFile)
	json.Unmarshal(byteValue, &Blockchain)
}

// Write Blockchain to blockchain.json
func writejson() {
	jsonFile, _ := json.MarshalIndent(Blockchain, "", " ")

	_ = ioutil.WriteFile("blockchain.json", jsonFile, 0644)
}

func readUserjson() {
	jsonFile, err := os.Open("users.json")
	if err != nil {
		log.Fatal(err)
	}
	byteValue, _ := ioutil.ReadAll(jsonFile)
	json.Unmarshal(byteValue, &UserProfiles)
}

func writeUserjson() {
	jsonFile, _ := json.MarshalIndent(UserProfiles, "", " ")

	err := ioutil.WriteFile("users.json", jsonFile, 0644)
	if err != nil {
		panic(err)
	}
}

var Blockchain []Block
var UserProfiles []User
var AllRequest []BuySellRequest      // Consist of all buy and sell request in one session
var DailyBiddingRange []BiddingRange // Consist of all bidding range for one day
