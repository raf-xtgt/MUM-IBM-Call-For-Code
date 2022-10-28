const path = require('path')
const express = require('express')
const authRoute = express.Router();
const auth = require('../../utils/authUtils')

// database access
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const db = getFirestore();


authRoute.post("/SignUp", async(req, res) => {
    console.log("Sign up from frontend", req.body)

    const email = req.body.email
    const password = auth.hash(req.body.password) 
    console.log("hashed password", password)

    try {
        // add the new user and their id
        let resDb = await db.collection("users").add(req.body)
        const docId = resDb.id + ""
        await db.collection("users").doc(docId).update({ userId: "SH "+ docId })
     
        // return if all goes well
        // res.json({ success: true })
        res.send({Success:true})



    } catch (error) {
        console.log(error)
        // res.json({ success: false })
        res.send({Success:false})
    }


});


authRoute.post("/Login", async(req, res) => {
    console.log("Login request from frontend", req.body)

    const email = req.body.email
    const password = auth.hash(req.body.password) 
    console.log("hashed password", password)
    console.log("entered email", email)

    try {
        const citiesRef = db.collection('users');
        const snapshot = await citiesRef.where('email', '==', email).get();
        if (snapshot.empty) {
            console.log('Login details do not match');
            return;
        }else{
            console.log("Login details match")
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                return res.send({Success:true, Data:doc.data() })
                
            });
        }



    } catch (error) {
        console.log(error)
        // res.json({ success: false })
        res.send({Success:false})
    }


});


module.exports = authRoute;
