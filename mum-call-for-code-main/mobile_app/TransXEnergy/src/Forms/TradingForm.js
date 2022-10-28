import React, { useState } from "react"
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import OpenRequests from './OpenRequests';
import energyRequestApi from '../middleware/energyRequests'
import authToken from '../utils/userDataCaching'

export default function TradingForm({chosenFeature, formHeader}){

    // to take the amount of energy ordered
    const [energyAmount, setOrderedAmount] = useState(0)
    
    // to make energy request for smart homes
    const handleSHEnRequest = async () => {
        
        const userToken = await authToken.readUserToken()
        console.log("Stored user token", userToken)

        let energyRequest = {
            BidID: 'BD ',           
            UserID: userToken.userId,        
            UserPrice: parseFloat( (0.2 * energyAmount) ),
            UserEnergy: parseFloat(energyAmount),    
            Prosumer_or_EV : 'SH',
            Buyer_or_Seller: 'Buy',  // buyer since making enery request
            Processed: false
        }

        const response = await energyRequestApi.createEnergyRequest(energyRequest)
        console.log("SH Energy request response on the frontend side", response)
        if (response.Success){
            setOrderedAmount(0)
            return (
                Alert.alert(
                    "Success",
                    "Smart Home Energy Request Successful ",
                    [{text:"OK",}]
                )
            )
        }
        
    }

    if (chosenFeature=="Order Energy") {
        return (
            <View style={styles.container}>
                <Text
                    style={styles.text}
                > 
                    {formHeader}</Text>
            
                
                <TextInput 
                    style = {styles.inputForm}
                    placeholder="Energy Amount (kWh)"
                    onChangeText={(value)=> setOrderedAmount(value)}
                />

                <Text style={styles.normalText}>Ordered Amount: {energyAmount} kWh</Text>

                <View style={styles.cardBtn}>
                    <TouchableOpacity onPress= {() => handleSHEnRequest()}>
                        <View>
                            <Text> Confirm </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                

            </View>
        )
    }
    else if (chosenFeature=="Make a bid") {
        return (
            
            <View  style={styles.container}>
                <OpenRequests />
            </View>

    
        )
    }
}



const styles = StyleSheet.create({
    container:{
        marginHorizontal:30,
    },
    
    inputForm:{
        marginTop:20,
        height:45,
        backgroundColor:'white',
        borderRadius:30,
        paddingHorizontal:10,
        fontSize:18,
        marginLeft: 10,
    },

    cardBtn:{
    
        flexDirection:"row",
        color:"white",
        width:100,
        height:50,
        textAlign:"center",
        borderRadius:30,
        borderWidth:2,
        marginVertical:10,
        marginHorizontal:75,
        borderColor:"black",
        // backgroundColor:"#98FB98",
        backgroundColor:"#24A0ED",
        alignItems:"center", // center the child items vertically
        justifyContent:"center", // center the child items horizontally,    
    },
    text:{
        textAlign:"center",
        fontWeight: "bold",
        fontSize: 20,
        color:'white'
    
    },
    normalText:{
        color:'white',
        textAlign:"center",
        fontSize:15
    }


  

})