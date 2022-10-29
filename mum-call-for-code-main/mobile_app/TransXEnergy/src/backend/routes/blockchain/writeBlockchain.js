const path = require('path')
const express = require('express')
const blockchainRoute = express.Router();

// database access
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const db = getFirestore();
const admin = require('firebase-admin')
const timestamp = admin.firestore.FieldValue.serverTimestamp()


// get the data required to run the customer matching algorithm
blockchainRoute.post("/WriteBlockchain", async(req, res) => {

    let data = req.body.data
    // console.log("Data from frontend", data)
    let newData = []
    for (let i=0; i<data.length; i++){
        let obj = data[i]
        obj.Index = i
        newData.push(obj)
    }
    console.log("New data", newData)
    let blockchain = {
        data:newData
    }
    // let resDb = await db.collection("blockchain").add(data)
    await db.collection("blockchain").doc("global").set(blockchain);

    console.log("blockchain", blockchain.data.length)

    //res.json({Success:true})
    res.send({Success:true})
});


blockchainRoute.post("/GetBlockchain", async(req, res) => {

    const blockchain = await db.collection("blockchain").doc("global").get()
    const blockchainDoc = blockchain.data().data
    console.log(blockchainDoc)

    //res.json({Success:true})
    res.send({Success:true, Data:blockchainDoc})
});



module.exports = blockchainRoute;