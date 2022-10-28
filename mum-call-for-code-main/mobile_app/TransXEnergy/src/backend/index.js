/** This is the main server file. All backend requests will start here */
// connect to firebase and all api calls to backend will be here

/** Setup the database */
const admin = require("firebase-admin");
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const {getAuth} = require('firebase-admin/auth')
// import { getAuth } from "firebase/auth";

const serviceAccount = require("./transxenergy-firebase-adminsdk-ry8e3-7b32c0268c.json");

// for firestore storage
const path = require('path');

initializeApp({
    credential: cert(serviceAccount),
});
const db = getFirestore();
// to get the metadata


/** Setup express js backend server */
const express = require("express")
const bodyParser = require('body-parser')
const cors = require("cors")
const app = express()

const corsOptions = {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials: true,
};

const {
    energyRequestRoute,
    authRoute,
    cmRoute,
    blockchainRoute

} = require('./routes');


// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(cors());


// Add Access Control Allow Origin headers
app.get('/', function(req, res) {
    res.send('hello server 8080 is working ');
})

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept",
        'GET,PUT,POST,DELETE,OPTIONS'
    );
    next();
});


// route to branch data files
app.use('/EnergyRequest', energyRequestRoute)
app.use('/Auth', authRoute)
app.use('/CustomerMatching', cmRoute) 
app.use('/Blockchain', blockchainRoute)



// set port, listen for requests
const PORT =  8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});