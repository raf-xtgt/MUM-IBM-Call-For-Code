package main

import (
	"crypto/sha256"
	"encoding/csv"
	"encoding/hex"
	"fmt"
	"math"
	"os"
	"path/filepath"
	"reflect"
	"strconv"
)

func createGenesisBlock() Block {
	var genesisTransaction Transaction
	genesisTransaction.UserID = ""
	genesisTransaction.Energy = 0.0
	genesisTransaction.Money = 0.0
	genesisTransaction.Price = 0.0

	var genesisTransactionList []Transaction
	genesisTransactionList = append(genesisTransactionList, genesisTransaction)

	var genesisBlock Block
	genesisBlock.Data = genesisTransactionList
	genesisBlock.Index = 0
	genesisBlock.PrevHash = "Genesis"
	genesisBlock.Hash = calculateHash(genesisBlock)
	genesisBlock.TNBMoney = 0.0
	genesisBlock.TNBEnergy = 0.0
	genesisBlock.LeaderID = ""

	return genesisBlock

}

func calculateHash(block Block) string {
	record := stringifyData(block.Data)
	record = record + strconv.Itoa(block.Index) + block.PrevHash +
		fmt.Sprintf("%v", block.TNBMoney) + fmt.Sprintf("%v", block.TNBEnergy)
	h := sha256.New()
	h.Write([]byte(record))
	hashed := h.Sum(nil)
	return hex.EncodeToString(hashed)
}

// convert the data to string, an automated method
func stringifyData(TransactionDataList []Transaction) string {
	var record string
	for i := 0; i < len(TransactionDataList); i++ {
		v := reflect.ValueOf(TransactionDataList[i])
		// v.Type() gives the field name
		for j := 0; j < v.NumField(); j++ {
			record = record + fmt.Sprintf("%v", v.Field(j).Interface())
		}
	}
	return record
}

func createBlock() Block {
	// fmt.Println("Before read output")
	TransactionDataList := readOutput()
	// fmt.Println("After read output")
	var newBlock Block
	newBlock.Data = TransactionDataList
	newBlock.PrevHash = Blockchain[len(Blockchain)-1].Hash
	newBlock.Index = Blockchain[len(Blockchain)-1].Index + 1
	newBlock.TNBMoney = math.Round(calculateTNBMoney(newBlock)*100) / 100
	newBlock.TNBEnergy = math.Round(calculateTNBEnergy(newBlock)*100) / 100
	newBlock.Hash = calculateHash(newBlock)
	newBlock.LeaderID = NextLeader()

	return newBlock
}

// for now, assume the solution from cplex is always optimal
func VerifyOptimality(newBlock Block) bool {
	var flag bool
	RunPoSo()

	path, _ := filepath.Abs("./Proof of Solution/Proof of Solution/KKT result/KKT_Result.csv")
	file, err := os.Open(path)
	if err != nil {
		fmt.Println(err)
	}
	records, err := csv.NewReader(file).ReadAll()
	if err != nil {
		fmt.Println(err)
	}
	value, _ := strconv.Atoi(records[0][0])
	if value == 1 {
		flag = true
	} else {
		flag = false
	}
	return flag
}

func calculateTNBMoney(newBlock Block) float64 {
	TNBReceivable := 0.0
	for i := 0; i < len(newBlock.Data); i++ {
		TNBReceivable += newBlock.Data[i].Money
	}
	TNBReceivable *= -1
	return TNBReceivable
}

func calculateTNBEnergy(newBlock Block) float64 {
	TNBReceivable := 0.0
	for i := 0; i < len(newBlock.Data); i++ {
		TNBReceivable += newBlock.Data[i].Energy
	}
	TNBReceivable *= -1
	return TNBReceivable
}

func calculateBlockchainHash(chain []Block) string {

	// Turn everything inside the blockchain to string
	var record string
	for i := 0; i < len(chain); i++ {
		block := chain[i]
		records := stringifyData(block.Data)
		record = records + strconv.Itoa(block.Index) + block.PrevHash + fmt.Sprintf("%v", block.TNBMoney) + fmt.Sprintf("%v", block.TNBEnergy)
	}

	h := sha256.New()
	h.Write([]byte(record))
	hashed := h.Sum(nil)
	return hex.EncodeToString(hashed)
}
