// we make the http requests to access the backend from this file

// to hold the outputs from the functions
import { useState } from "react"
const serverURL = "http://192.168.100.13:8989/"
const energyRequest = "EnergyRequest/"
const addEnergyRequestURL = serverURL + energyRequest + "AddEnergyRequest"

// make the api call to add energy request
export default () => {

    const [results, setResults] = useState({
        data:null
    })

    const addEnergyRequest = async (data) => {


        try{
            console.log(addEnergyRequestURL)
            return await fetch(addEnergyRequestURL,
                {
                    method:'POST',
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                      },
                    body: JSON.stringify(data)
                })

                .then((response) => response.json())
                .then((json) => {
                    console.log("here", json)
                  
                })
                .catch((error) => {
                  console.error(error);
                });
            

              
                // const output = response
                // console.log(response)
                // setResults({data:output})
            

               
            
        }catch(error){
            console.log("is shit")
            console.log(error)
        }
    }
    console.log("Here the results", results)
    return [results, addEnergyRequest]


}




// api call to sign up user

