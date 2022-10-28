// // we make the http requests to access the backend from this file

// // to hold the outputs from the functions
// import { useState } from "react"
// const serverURL = "http://localhost:8080/"
// const energyRequest = "EnergyRequest/"
// const addEnergyRequestURL = serverURL + energyRequest + "AddEnergyRequest"

// // make the api call to add energy request
// export default () => {

//     const [results, setResults] = useState({
//         data:null
//     })

//     const addEnergyRequest = async (data) => {


//         try{
//             console.log(addEnergyRequestURL)
//             const response = await fetch(addEnergyRequestURL,
//                 {
//                     method:'POST',
//                     headers: {
//                         Accept: 'application/json',
//                         'Content-Type': 'application/json'
//                       },
//                     body: JSON.stringify({data})
//                 })
//                 const output = response
                
//                 setResults({data:output})
            
//         }catch(error){
//             console.log("is shit")
//             console.log(error)
//         }
//     }

//     return [results, addEnergyRequest]

// }



// we make the http requests to access the backend from this file

// to hold the outputs from the functions
import { useState } from "react"
const serverURL = "http://localhost:8080/"
const energyRequest = "EnergyRequest/"
const addEnergyRequestURL = serverURL + energyRequest + "AddEnergyRequest"

// make the api call to add energy request
export default () => {

    const [results, setResults] = useState({
        data:null
    })

     const addEnergyRequest = async (data) => {


        //192.168.100.13
        // "http://172.17.0.1:8080/EnergyRequest/AddEnergyRequest"
        try{
            const request = await new Request("http://192.168.100.13:8080/EnergyRequest/AddEnergyRequest", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            });
 
            //fetch(request);
            await fetch(request)
                .then((response) => console.log("here is the response,", response))
                
                .catch((error) => {
                    console.log("is shit")
                console.error(error);
                });

            console.log("The fetch worked ig")

        
        }catch(error){
            console.log("is shit")
            console.log(error)

        }
    }

    return [results, addEnergyRequest]

}

