package main

import (
	"encoding/csv"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
)

func runNashEVDispatch() {
	path, _ := filepath.Abs("C:/Users/Teoh/New folder/mum-call-for-code/cplex/Disagreement Point/x64/Release/Nash.exe")
	println(path)
	cmd := exec.Cmd{
		Path:   path,
		Stdout: os.Stdout,
		Stderr: os.Stdout,
	}
	cmd.Start()
	cmd.Wait()
}

func runBiddingRange() {
	path, _ := filepath.Abs("C:/Users/Teoh/New folder/mum-call-for-code/cplex/Disagreement Point/x64/Release/Bidding Range.exe")
	println(path)
	cmd := exec.Cmd{
		Path:   path,
		Stdout: os.Stdout,
		Stderr: os.Stdout,
	}
	cmd.Start()
	cmd.Wait()
}

func runPoSo() {
	cmd := exec.Cmd{
		Path: "C:/Users/Teoh/New folder/mum-call-for-code/cplex/Disagreement Point/x64/Release/PoSo Verify.exe",

		Stdout: os.Stdout,
		Stderr: os.Stdout,
	}
	cmd.Start()
	cmd.Wait()
}

// execute the cplex exe file to run the customer matching algorithm
func runCustomerMatchingAlgorithm() {
	cmd := exec.Cmd{
		// change the path relative to ur own
		Path: "C:/Users/Teoh/New folder/mum-call-for-code/cplex/Disagreement Point/x64/Release/Project20.exe",
		//Path:   "./mum-call-for-code/cplex/Project20/x64/Release/Project20.exe",
		Stdout: os.Stdout,
		Stderr: os.Stdout,
	}
	cmd.Start()
	cmd.Wait()
}

// read the neccessary ouput from cplex folder, might need to read more output afterwards
// for the csv file, the row is the time in 30 minutes and the column is the users
func readOutputfromCPLEX(numUser int, timeslot int) []Transaction {
	//Path := "./mum-call-for-code/cplex/Project20/Project20/game theory and double auction/"
	Path := "C:/Users/Teoh/New folder/mum-call-for-code/cplex/Project20/Project20/game theory and double auction/"
	FileNameNeeded := [4]string{"p2pBuy", "p2pSell", "bid buy price", "bid sell price"}
	var TransactionDataList []Transaction
	for i := 0; i < numUser; i++ {
		var TransactionData Transaction
		TransactionData.Energy = 0.0
		for j := 0; j < len(FileNameNeeded); j++ {
			file, err := os.Open(Path + FileNameNeeded[j] + ".csv")
			if err != nil {
				fmt.Println(err)
			}
			records, err := csv.NewReader(file).ReadAll()
			if err != nil {
				fmt.Println(err)
			}
			// obtain the repective row for the specific timeslot
			record := records[timeslot]
			// for now just assume user id is 1,2,3...
			TransactionData.UserID = i

			if FileNameNeeded[j] == "p2pBuy" {
				value, _ := strconv.ParseFloat(record[i], 32)
				fmt.Println(value)
				if value == 0 {
					fmt.Println("No data for p2pBuy")
				} else {
					TransactionData.Energy = value
				}
			} else if FileNameNeeded[j] == "p2pSell" {
				value, _ := strconv.ParseFloat(record[i], 32)
				fmt.Println(value)
				if value == 0 {
					fmt.Println("No data for p2pSell")
				} else {
					TransactionData.Energy = value * -1.0
				}
			} else if FileNameNeeded[j] == "bid buy price" && TransactionData.Energy >= 0 {
				TransactionData.Price, _ = strconv.ParseFloat(record[i], 32)
			} else if FileNameNeeded[j] == "bid sell price" && TransactionData.Energy <= 0 {
				TransactionData.Price, _ = strconv.ParseFloat(record[i], 32)
			}

		}
		if TransactionData.Energy == 0 {
			fmt.Println("No data")
			continue
		} else {
			TransactionData.Money = TransactionData.Energy * TransactionData.Price * -1
			TransactionDataList = append(TransactionDataList, TransactionData)
		}

	}
	return TransactionDataList
}
