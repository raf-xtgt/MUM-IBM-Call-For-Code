const serverURL = "http://192.168.100.13:8989/"
const energyRequest = "Blockchain/"
const blockchainRequest = serverURL + energyRequest + 'WriteBlockchain'
const getBlockchainRequest = serverURL + energyRequest + 'GetBlockchain'


async function writeBlockchain(data){
    
    try{      
        return await fetch(blockchainRequest,
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
                // console.log("Here are the results",json)
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

async function getBlockchain(data){
    
    try{      
        return await fetch(getBlockchainRequest,
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
                // console.log("Here are the results",json)
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


module.exports = {writeBlockchain, getBlockchain}