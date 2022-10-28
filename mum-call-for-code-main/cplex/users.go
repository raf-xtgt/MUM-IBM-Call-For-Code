package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strconv"
)

// Create a new user, might need to change the input depending on the front end
func createUser(CSorSH string, Type string) {
	newid := ""
	if CSorSH == "CS" {
		newid = "CS " + strconv.Itoa(len(UserProfiles)+1)
	} else if CSorSH == "SH" {
		newid = "SH " + strconv.Itoa(len(UserProfiles)+1)
	}
	fmt.Println(newid)
	var newUser User
	newUser.UserID = newid
	newUser.Address = ""
	newUser.Email = ""
	newUser.Password = ""
	newUser.SmartMeterNo = 0
	newUser.MoneyBalance = 2000.0
	newUser.EnergyBalance = 800.0
	newUser.Type = Type
	// Leader will need to input IC Num, other than that just keep as 0
	if Type == "Leader" {
		newUser.ICNum = 1234
	} else {
		newUser.ICNum = 0
	}
	UserProfiles = append(UserProfiles, newUser)
	writeUserjson()
}

// Write the central blockchain into each individual json file
func writeLocalBlockchain(myLocalBlockchain []Block) {
	myBlockchainHash := calculateBlockchainHash(myLocalBlockchain)
	var thisBlockchain LocalBlockchain
	thisBlockchain.Blockchain = myLocalBlockchain
	thisBlockchain.BlockchainHash = myBlockchainHash
	for i := 0; i < len(UserProfiles); i++ {
		// Only store for clerk
		if UserProfiles[i].Type == "Clerk" {
			path, err := filepath.Abs("./LocalBlockchainCopies")
			if err != nil {
				fmt.Println(err)
			}
			filename := "/blockchain_" + UserProfiles[i].UserID + ".json"
			jsonFile, _ := json.MarshalIndent(thisBlockchain, "", " ")

			_ = ioutil.WriteFile(path+filename, jsonFile, 0644)

		}
	}
}

// Get the majority blockchain hash from all individual json files
func CheckOccurenceBlockchain() (string, string) {
	var myLocalBlockchain LocalBlockchain
	var BlockchainHashSet []string
	var count []int
	var ClerkId []string
	for i := 0; i < len(UserProfiles); i++ {
		if UserProfiles[i].Type == "Clerk" {
			path, err := filepath.Abs("./LocalBlockchainCopies")
			if err != nil {
				fmt.Println(err)
			}
			filename := "/blockchain_" + UserProfiles[i].UserID + ".json"
			jsonFile, err := os.Open(path + filename)
			if err != nil {
				log.Fatal(err)
			}
			byteValue, _ := ioutil.ReadAll(jsonFile)
			json.Unmarshal(byteValue, &myLocalBlockchain)
			Index, Exist := checkHashExist(myLocalBlockchain.BlockchainHash, BlockchainHashSet)
			// If exist, its correspond count + 1
			if Exist {
				count[Index] = count[Index] + 1
			} else {
				// New Hash, append to the current array
				BlockchainHashSet = append(BlockchainHashSet, myLocalBlockchain.BlockchainHash)
				count = append(count, 1)
				ClerkId = append(ClerkId, UserProfiles[i].UserID)
			}

		}
	}
	fmt.Println(BlockchainHashSet)
	fmt.Println(count)
	//Find max/majority
	max := count[0]
	var MaxOccurenceHash string
	var HonestClerk string
	for i := 0; i < len(count); i++ {
		if count[i] > max {
			max = count[i]
		}
		MaxOccurenceHash = BlockchainHashSet[i]
		HonestClerk = ClerkId[i]
	}
	return MaxOccurenceHash, HonestClerk // Return Honest Clerk to obtain the correct blockchain easier

}

func checkHashExist(Hash string, Array []string) (int, bool) {
	for i, j := range Array {
		if j == Hash {
			return i, true
		}
	}
	return -1, false
}

// Check whether the central blockchain is the same as majority
func checkBlockchainValid() {
	var myLocalBlockchain LocalBlockchain
	fmt.Println(calculateBlockchainHash(Blockchain))

	//Acquire the most frequent appear blockchain hash
	MostOccurenceHash, HonestClerkID := CheckOccurenceBlockchain()

	if MostOccurenceHash == calculateBlockchainHash(Blockchain) {
		fmt.Println("Current Blockchain is Correct")
	} else {
		fmt.Println("Current Blockchain is Updated")
		// Obtain the blockchain corresponding to the blockchain hash
		path, err := filepath.Abs("./LocalBlockchainCopies")
		if err != nil {
			fmt.Println(err)
		}
		filename := "/blockchain_" + HonestClerkID + ".json"
		jsonFile, err := os.Open(path + filename)
		if err != nil {
			log.Fatal(err)
		}
		byteValue, _ := ioutil.ReadAll(jsonFile)
		json.Unmarshal(byteValue, &myLocalBlockchain)

	}
}

// Obtain the next leader ID for the block creation
func NextLeader() string {
	var LeaderIDArray []string
	var NextLeaderID string

	// Obtain a list contain all the leaders
	for i := 0; i < len(UserProfiles); i++ {
		if UserProfiles[i].Type == "Leader" {
			LeaderIDArray = append(LeaderIDArray, UserProfiles[i].UserID)
		}
	}

	// An exception for the first block after the genesis block
	if len(Blockchain) == 1 {
		NextLeaderID = LeaderIDArray[0]
	} else {
		// Check if the leader in the last blockchain is the last leader in the leader array
		if Blockchain[len(Blockchain)-1].LeaderID == LeaderIDArray[len(LeaderIDArray)-1] {
			// if yes, the leader for the next block will be the first leader
			NextLeaderID = LeaderIDArray[0]
		} else {
			// Just find the next leader who is responsible
			for j := 0; j < len(LeaderIDArray); j++ {
				if Blockchain[len(Blockchain)-1].LeaderID == LeaderIDArray[j] {
					NextLeaderID = LeaderIDArray[j+1]
				}
			}
		}
	}

	return NextLeaderID
}
