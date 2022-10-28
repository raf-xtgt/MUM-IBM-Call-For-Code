const path = require('path')
const express = require('express')
const cmRoute = express.Router();

// database access
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const db = getFirestore();
const admin = require('firebase-admin')
const timestamp = admin.firestore.FieldValue.serverTimestamp()


// get the data required to run the customer matching algorithm
cmRoute.post("/GetCMData", async(req, res) => {

    let allRequests = []

    // get the processed energy requests
    const reqRef = db.collection('energyRequests');
    const snapshot = await reqRef.where('Processed', '==', true).get();
    
    snapshot.forEach(doc => {
        allRequests.push(doc.data())
    });

    // get the bids
    const bidRef = db.collection('bids');
    const bidSnapshot = await bidRef.get();

    bidSnapshot.forEach(doc => {
        allRequests.push(doc.data())
    });
    console.log("All Requests", allRequests)
    

    //res.json({Success:true})
    res.send({Success:true, Data:allRequests})
});


module.exports = cmRoute;