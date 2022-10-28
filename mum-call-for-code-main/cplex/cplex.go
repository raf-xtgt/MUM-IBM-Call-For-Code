package main

import (
	"encoding/csv"
	"fmt"
	"math"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"

	"github.com/plus3it/gorecurcopy"
)

func RunPoSo() {
	path, _ := filepath.Abs("./Proof of Solution/x64/Release/Proof of Solution.exe")
	path2, _ := filepath.Abs("./Proof of Solution/Proof of Solution")
	cmd := &exec.Cmd{
		Path:   path,
		Dir:    path2,
		Stdout: os.Stdout,
		Stderr: os.Stdout,
	}
	cmd.Start()
	cmd.Wait()
}
func RunCustomerMatching() (bool, Block) {
	// Write all the request into its respective field in csv file
	WriteProsumerList()
	WritePowerConsumption()
	WriteBiddingPrice()
	WriteSolar()

	// Run Customer Matching Algorithm
	path, _ := filepath.Abs("./Customer Matching/x64/Release/Customer Matching.exe")
	path2, _ := filepath.Abs("./Customer Matching/Customer Matching")
	cmd := exec.Cmd{
		Path:   path,
		Dir:    path2,
		Stdout: os.Stdout,
		Stderr: os.Stdout,
	}

	cmd.Start()
	cmd.Wait()

	// Copy the necessary files to another directory
	srcAddr, _ := filepath.Abs("./Customer Matching/Customer Matching/lagrange multiplier")
	destAddr, _ := filepath.Abs("./Proof of Solution/Proof of Solution/lagrange multiplier")
	err := gorecurcopy.CopyDirectory(srcAddr, destAddr)
	if err != nil {
		fmt.Println("ERRRROR 1")
		println(err)
	}

	srcAddr, _ = filepath.Abs("./Customer Matching/Customer Matching/broadcasted result")
	destAddr, _ = filepath.Abs("./Proof of Solution/Proof of Solution/broadcasted result")
	err = gorecurcopy.CopyDirectory(srcAddr, destAddr)
	if err != nil {
		fmt.Println("ERRRROR 2")
		println(err)
	}

	// Create a new temporary Block
	newBlock := createBlock()
	// Check the block using PoSo
	flag := VerifyOptimality(newBlock)
	return flag, newBlock

}
func RunNash() {
	fmt.Println("RUNNING NASH EQBM")
	path, _ := filepath.Abs("./Nash/x64/Release/Nash.exe")
	println(path)
	path2, _ := filepath.Abs("./Nash/Nash")
	cmd := &exec.Cmd{
		Path:   path,
		Dir:    path2,
		Stdout: os.Stdout,
		Stderr: os.Stdout,
	}
	cmd.Start()
	cmd.Wait()

	srcAddr, _ := filepath.Abs("./Nash/Nash/nash profit maximization")
	destAddr, _ := filepath.Abs("./bidding range/Bidding Range/nash profit maximization")
	err := gorecurcopy.CopyDirectory(srcAddr, destAddr)
	if err != nil {
		println(err)
	}
}
func RunBiddingRange() {
	fmt.Println("RUNNING BIDDING RANGE")
	path, _ := filepath.Abs("./bidding range/x64/Release/Bidding Range.exe")
	println(path)
	path2, _ := filepath.Abs("./bidding range/Bidding range")
	cmd := &exec.Cmd{
		Path:   path,
		Dir:    path2,
		Stdout: os.Stdout,
		Stderr: os.Stdout,
	}
	cmd.Start()
	cmd.Wait()

	BiddingRangePath, _ := filepath.Abs("./bidding range/Bidding Range/bidding range/bid range.csv")
	file, err := os.Open(BiddingRangePath)
	if err != nil {
		fmt.Println(err)
	}
	records, err := csv.NewReader(file).ReadAll()
	if err != nil {
		fmt.Println(err)
	}
	var SingleBiddingRange BiddingRange
	for i := 0; i < 24; i++ {
		SingleBiddingRange.MinBuyPrice, _ = strconv.ParseFloat(records[i][0], 32)
		SingleBiddingRange.MaxBuyPrice, _ = strconv.ParseFloat(records[i][1], 32)
		SingleBiddingRange.MinSellPrice, _ = strconv.ParseFloat(records[i][2], 32)
		SingleBiddingRange.MaxSellPrice, _ = strconv.ParseFloat(records[i][3], 32)
		DailyBiddingRange = append(DailyBiddingRange, SingleBiddingRange)
	}
	/* srcAddr, _ := filepath.Abs("./bidding range/Bidding Range/nash profit maximization")
	destAddr, _ := filepath.Abs("./Customer Matching/Customer Matching/nash profit maximization")
	err := gorecurcopy.CopyDirectory(srcAddr, destAddr)
	if err != nil {
		println(err)
	} */
	/* srcAddr, _ = filepath.Abs("./bidding range/Bidding Range/bidding range")
	destAddr, _ = filepath.Abs("./Customer Matching/Customer Matching/bidding range")
	err = gorecurcopy.CopyDirectory(srcAddr, destAddr)
	if err != nil {
		println(err)
	} */
}

// Read the output and complete the transaction data
func readOutput() []Transaction {
	//fmt.Println("Inside readOutput")
	path, _ := filepath.Abs("./Customer Matching/Customer Matching/broadcasted result/power.csv")
	file, err := os.Open(path)
	if err != nil {
		fmt.Println(err)
	}
	records, err := csv.NewReader(file).ReadAll()
	//fmt.Println("All records", len(records))
	if err != nil {
		fmt.Println(err)
	}
	var TransactionDataList []Transaction
	var TransactionData Transaction
	TransactionData.Energy = 0.0
	TransactionData.Money = 0.0
	// Find unique User ID
	_, UniqueUserID := getUniqueID()
	//fmt.Println("Unique Id size", len(UniqueUserID))
	for i := 0; i < len(UniqueUserID); i++ {
		for j := 0; j < len(records); j++ {
			if AllRequest[j].UserID == UniqueUserID[i] {
				TransactionData.UserID = UniqueUserID[i]
				// Obtain the details of how much power goes to where
				PowerBuyFromGrid, _ := strconv.ParseFloat(records[j][0], 32)
				PowerSellToGrid, _ := strconv.ParseFloat(records[j][1], 32)
				PowerBuyFromMarket, _ := strconv.ParseFloat(records[j][2], 32)
				PowerSellToMarket, _ := strconv.ParseFloat(records[j][3], 32)
				TransactionData.Energy += PowerBuyFromGrid + PowerBuyFromMarket - PowerSellToGrid - PowerSellToMarket
				TransactionData.Money += -1 * AllRequest[j].UserPrice * TransactionData.Energy
			}
		}
		if TransactionData.Energy == 0.0 {
			fmt.Println("No data")
		} else {
			// Only append transaction data if its not empty
			TransactionData.Money = math.Round(TransactionData.Money*100) / 100
			TransactionDataList = append(TransactionDataList, TransactionData)
		}
	}
	//fmt.Println("readOutput finish")
	return TransactionDataList
}
