/**
 * First add all the buy energy requests in the db
 * Then retrieve all of them every 30 mins (for unseen ones) and run for Customer Matching
 */
// to hold the outputs from the functions

const serverURL = "http://192.168.100.13:8989/"
const golangServer = "http://192.168.100.13:8888/"
const initCMRequest = golangServer + "InitCM"
const energyRequest = "CustomerMatching/"
const cmData = serverURL + energyRequest + 'GetCMData'

// get the data required to run customer matching
async function getCMData(data){
    
    try{
       
        console.log("Data to send to backend", data)
        return await fetch(cmData,
            {
                method:'POST',
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(data)
            })

            .then(async (response) => await response.json())
            .then(async (json) => {
                //console.log("here", json)
                console.log("Here are the results",json)
                return json
              
            })
            .catch((error) => {
              console.error(error);
            });
           
        
    }catch(error){
        console.log("Error")
        console.log(error)
    }

}


//  run customer matching in the backend
async function runCM(data){
    
    try{
       
        console.log("Data to send to backend", data)
        return await fetch(initCMRequest,
            {
                method:'POST',
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(data)
            })

            .then(async (response) => await response.json())
            .then(async (json) => {
                //console.log("here", json)
                console.log("Here are the results",json)
                return json
              
            })
            .catch((error) => {
              console.error(error);
            });
           
        
    }catch(error){
        console.log("Error")
        console.log(error)
    }

}




module.exports = {getCMData, runCM}