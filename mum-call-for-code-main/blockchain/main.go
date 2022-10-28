package main

import (
	"encoding/json"
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
	runNashEVDispatch()
	runBiddingRange()
	go func() {
		if Blockchain == nil {
			genesisBlock := createGenesisBlock()
			Blockchain = append(Blockchain, genesisBlock)
		}
	}()
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
/* func writejson() {
	jsonFile, _ := json.MarshalIndent(Blockchain, "", " ")

	_ = ioutil.WriteFile("blockchain.json", jsonFile, 0644)
} */

var Blockchain []Block
