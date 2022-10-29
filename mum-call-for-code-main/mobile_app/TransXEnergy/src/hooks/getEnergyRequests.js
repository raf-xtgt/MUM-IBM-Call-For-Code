import {useState} from "react"
const serverURL = "http://192.168.100.13:8989/"
const energyRequest = "EnergyRequest/"
const getEnergyRequests = serverURL + energyRequest + 'GetEnergyRequest'


export default () => {

    // init state variables
    const [results, setResults] = useState({
        data:{
            Data: "Data"
        },

    })

    // making api requests
    const getAllEnergyRequests = async (data) => {
        

        try{
       
            //console.log("Data to send to backend", data)
            return await fetch(getEnergyRequests,
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
                    //console.log("Here are the results",json)
                    setResults({
                        data:json
                    })
                    return [results, getAllEnergyRequests]
                  
                })
                .catch((error) => {
                  console.error(error);
                });
               
            
        }catch(error){
            console.log("Error")
            console.log(error)
        }

        
    

    };

    // return from the whole exported function
    //console.log("Prediction results", results)
    return [results, getAllEnergyRequests]
}
