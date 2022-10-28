package main

import (
	"encoding/csv"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

func WriteProsumerList() {
	var empData [][]string
	var BidIDList []string
	var typeOfProsumer []string
	//numUniqueID, UniqueIDList := getUniqueID()
	BidIDList = append(BidIDList, "Name")
	typeOfProsumer = append(typeOfProsumer, "Type")
	for i := 0; i < len(AllRequest); i++ {
		BidIDList = append(BidIDList, AllRequest[i].BidID)
		s := strings.Split(AllRequest[i].UserID, " ")
		if s[0] == "CS" {
			typeOfProsumer = append(typeOfProsumer, strconv.Itoa(0))
		} else if s[0] == "SH" {
			typeOfProsumer = append(typeOfProsumer, strconv.Itoa(1))
		}
	}
	empData = append(empData, BidIDList)
	empData = append(empData, typeOfProsumer)
	empData = transpose(empData)
	//fmt.Println("The print")
	fmt.Println(empData)
	WritetoCSV(empData, "Customer Matching/Customer Matching/Prosumer list.csv")

}
func WritePowerConsumption() {
	var empData [][]string
	var BidIDList []string
	var AmountofEnergy []string
	BidIDList = append(BidIDList, "Name")
	AmountofEnergy = append(AmountofEnergy, "Load")
	//numUniqueID, UniqueIDList := getUniqueID()
	for i := 0; i < len(AllRequest); i++ {
		BidIDList = append(BidIDList, AllRequest[i].BidID)
		AmountofEnergy = append(AmountofEnergy, fmt.Sprintf("%v", AllRequest[i].UserEnergy))
	}
	empData = append(empData, BidIDList)
	empData = append(empData, AmountofEnergy)
	empData = transpose(empData)
	WritetoCSV(empData, "Customer Matching/Customer Matching/Power consumption.csv")

}

func WriteBiddingPrice() {
	var empData [][]string
	var BidIDList []string
	var BuyOrSell []string
	var BiddingPrice []string
	//numUniqueID, UniqueIDList := getUniqueID()
	BidIDList = append(BidIDList, "Name")
	BuyOrSell = append(BuyOrSell, "BuyOrSell")
	BiddingPrice = append(BiddingPrice, "Price")
	for i := 0; i < len(AllRequest); i++ {
		BidIDList = append(BidIDList, AllRequest[i].BidID)
		if AllRequest[i].Buyer_or_Seller == "Buy" {
			BuyOrSell = append(BuyOrSell, strconv.Itoa(1))
		} else if AllRequest[i].Buyer_or_Seller == "Sell" {
			BuyOrSell = append(BuyOrSell, strconv.Itoa(-1))
		}
		BiddingPrice = append(BiddingPrice, fmt.Sprintf("%v", AllRequest[i].UserEnergy))
	}
	empData = append(empData, BidIDList)
	empData = append(empData, BuyOrSell)
	empData = append(empData, BiddingPrice)
	empData = transpose(empData)
	WritetoCSV(empData, "Customer Matching/Customer Matching/customer bidding/bidding.csv")
}

func WriteSolar() {
	var empData [][]string
	var BidIDList []string
	var AmountofSolar []string
	//numUniqueID, UniqueIDList := getUniqueID()
	BidIDList = append(BidIDList, "Name")
	AmountofSolar = append(AmountofSolar, "Solar")
	for i := 0; i < len(AllRequest); i++ {
		BidIDList = append(BidIDList, AllRequest[i].BidID)
		AmountofSolar = append(AmountofSolar, fmt.Sprintf("%v", 3.9748))
	}
	empData = append(empData, BidIDList)
	empData = append(empData, AmountofSolar)
	empData = transpose(empData)
	WritetoCSV(empData, "Customer Matching/Customer Matching/Solar.csv")
}

// This functions return the number of unique ID and
// an array containing all unique ID
func getUniqueID() (int, []string) {
	var uniqueID []string
	uniqueID = append(uniqueID, AllRequest[0].UserID)
	for i := 1; i < len(AllRequest); i++ {
		exist := searchArray(AllRequest[i].UserID, uniqueID)
		if !exist {
			uniqueID = append(uniqueID, AllRequest[i].UserID)
		}

	}
	return len(uniqueID), uniqueID
}

func searchArray(target string, array []string) bool {
	for i := 0; i < len(array); i++ {
		if target == array[i] {
			return true
		}
	}
	return false
}

func transpose(slice [][]string) [][]string {
	xl := len(slice[0])
	yl := len(slice)
	result := make([][]string, xl)
	for i := range result {
		result[i] = make([]string, yl)
	}
	for i := 0; i < xl; i++ {
		for j := 0; j < yl; j++ {
			result[i][j] = slice[j][i]
		}
	}
	return result
}

func WritetoCSV(data [][]string, filename string) {
	curPath, err := filepath.Abs(filename)
	if err != nil {
		fmt.Println(err)
	}
	csvFile, err := os.Create(curPath)
	if err != nil {
		fmt.Println(err)
	}
	csvWriter := csv.NewWriter(csvFile)
	err = csvWriter.WriteAll(data)
	if err != nil {
		fmt.Println(err)
	}
	csvWriter.Flush()
	csvFile.Close()
}
