import AsyncStorage from '@react-native-async-storage/async-storage';
const USER_TOKEN_KEY = '@TXE_USER_TOKEN'
// store user auth in the local storage
async function storeUserToken(data){
    
    try{
        const jsonValue = JSON.stringify(data)
        await AsyncStorage.setItem(USER_TOKEN_KEY, jsonValue)
        
    }catch(error){
        console.log("Error")
        console.log(error)
    }

}


async function readUserToken(){
    
    try{
        const jsonValue = await AsyncStorage.getItem(USER_TOKEN_KEY)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
        
        
    }catch(error){
        console.log("Error")
        console.log(error)
    }

}

module.exports = {storeUserToken, readUserToken}