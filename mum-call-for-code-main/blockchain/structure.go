package main

type Block struct {
	Index         int
	Data          []Transaction
	Hash          string
	PrevHash      string
	TNBReceivable float64
}

// If the user is buying energy, then money will be negative and energy will be positive
// The price varies every time, money = energy * price
type Transaction struct {
	UserID int
	Money  float64
	Energy float64
	Price  float64
}

type User struct {
	UserID       int
	Email        string
	Password     string
	Address      string
	SmartMeterNo int
	Type         string
}

type Validator struct {
	UserID   int
	Email    string
	Password string
	Address  string
	Type     string
	FullName string
	ICNum    int
}
