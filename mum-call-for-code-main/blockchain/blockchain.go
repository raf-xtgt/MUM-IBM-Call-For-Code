package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"reflect"
	"strconv"
)

func createGenesisBlock() Block {
	var genesisTransaction Transaction
	genesisTransaction.UserID = 0
	genesisTransaction.Energy = 0.0
	genesisTransaction.Money = 0.0
	genesisTransaction.Price = 0.0

	var genesisTransactionList []Transaction
	genesisTransactionList = append(genesisTransactionList, genesisTransaction)

	var genesisBlock Block
	genesisBlock.Data = genesisTransactionList
	genesisBlock.Index = 0
	genesisBlock.PrevHash = ""
	genesisBlock.Hash = calculateHash(genesisBlock)
	genesisBlock.TNBReceivable = 0.0

	return genesisBlock

}

func calculateHash(block Block) string {
	record := stringifyData(block.Data)
	record = record + strconv.Itoa(block.Index) + block.PrevHash + fmt.Sprintf("%v", block.TNBReceivable)
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

func createBlock(numUser int, timeslot int) Block {
	TransactionDataList := readOutputfromCPLEX(numUser, timeslot)
	var newBlock Block
	newBlock.Data = TransactionDataList
	newBlock.PrevHash = Blockchain[len(Blockchain)-1].Hash
	newBlock.Index = Blockchain[len(Blockchain)-1].Index + 1
	newBlock.TNBReceivable = calculateTNBReceivable(newBlock)
	newBlock.Hash = calculateHash(newBlock)

	return newBlock
}

// for now, assume the solution from cplex is always optimal
func VerifyOptimality(newBlock Block) bool {
	flag := true
	runPoSo()

	return flag
}

func calculateTNBReceivable(newBlock Block) float64 {
	TNBReceivable := 0.0
	for i := 0; i < len(newBlock.Data); i++ {
		TNBReceivable += newBlock.Data[i].Money
	}
	return TNBReceivable
}
