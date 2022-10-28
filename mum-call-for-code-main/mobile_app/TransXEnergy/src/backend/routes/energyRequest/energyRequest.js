const path = require('path')
const express = require('express')
const energyRequestRoute = express.Router();

// database access
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const db = getFirestore();
const admin = require('firebase-admin')
const timestamp = admin.firestore.FieldValue.serverTimestamp()



energyRequestRoute.post("/AddEnergyRequest", async(req, res) => {
    console.log("Request from frontend", req.body)
    //res.json({Success:true})
    res.send({Success:true})
});


// add energy request for smart homes
energyRequestRoute.post("/AddSHEnergyRequest", async(req, res) => {
    console.log("Request from frontend", req.body)
    try {
        // add the new user and their id
        let resDb = await db.collection("energyRequests").add(req.body)
        const docId = resDb.id + ""
        await db.collection("energyRequests").doc(docId).update({ requestId: docId })
     
        res.send({Success:true})

    } catch (error) {
        console.log(error)
        // res.json({ success: false })
        res.send({Success:false})
    }

});


// make a bid on an energy request
energyRequestRoute.post("/Bid", async(req, res) => {
    console.log("Request from frontend", req.body)
    const energyReqId = req.body.EnRequestId
    try {
        // add the new user and their id
        let resDb = await db.collection("bids").add(req.body)
        const docId = resDb.id + ""

        // update for the bid
        await db.collection("bids").doc(docId).update({ BidID: 'BD '+docId })/
        await db.collection("bids").doc(docId).update({ Time: timestamp })

        // update bid id in the energy request
        await db.collection("energyRequests").doc(energyReqId).update({ BidID: 'BD '+docId })
        await db.collection("energyRequests").doc(energyReqId).update({ Processed: true })

     
        res.send({Success:true})

    } catch (error) {
        console.log(error)
        // res.json({ success: false })
        res.send({Success:false})
    }

});



// get all unprocessed energy requests
energyRequestRoute.post("/GetEnergyRequest", async(req, res) => {
    console.log("Request from frontend", req.body)
    let energyRequests = []
    try {
        const citiesRef = db.collection('energyRequests');
        const snapshot = await citiesRef.where('Processed', '==', false).get();
        if (snapshot.empty) {
            console.log('No new energy requests');
            return;
        }else{
            console.log("Login details match")
            snapshot.forEach(doc => {
                energyRequests.push(doc.data())
                // console.log(doc.id, '=>', doc.data());
                // res.send({Success:true, Data:doc.data() })
            });
            res.send({Success:true, Data:energyRequests })

        }

    } catch (error) {
        console.log(error)
        // res.json({ success: false })
        res.send({Success:false})
    }

});

module.exports = energyRequestRoute;