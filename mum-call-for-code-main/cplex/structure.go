package main

type Block struct {
	Index     int
	Data      []Transaction
	Hash      string
	PrevHash  string
	TNBMoney  float64
	TNBEnergy float64
	LeaderID  string
}

// If the user is buying energy, then money will be negative and energy will be positive
// The price varies every time, money = energy * price
type Transaction struct {
	UserID string
	Money  float64
	Energy float64
	Price  float64
}

type User struct {
	UserID        string
	Email         string
	Password      string
	Address       string
	SmartMeterNo  int
	Type          string
	ICNum         int
	MoneyBalance  float64
	EnergyBalance float64
}

type LocalBlockchain struct {
	BlockchainHash string
	Blockchain     []Block
}

type BuySellRequest struct {
	BidID           string
	UserID          string
	UserPrice       float64
	UserEnergy      float64
	Prosumer_or_EV  string
	Buyer_or_Seller string
}

type BiddingRange struct {
	MinBuyPrice  float64
	MaxBuyPrice  float64
	MinSellPrice float64
	MaxSellPrice float64
}
