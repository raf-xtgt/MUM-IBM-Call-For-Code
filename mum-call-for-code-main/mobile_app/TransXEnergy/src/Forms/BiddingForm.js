import React, { useState } from "react"
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import energyRequestApi from '../middleware/energyRequests'
import authToken from '../utils/userDataCaching'
import * as RootNavigation from '../../RootNavigation'

export default function BiddingForm({formHeader, enRequestId}){

    // to take the amount of energy for bidding
    const [bidAmount, setBidAmount] = useState(0)
    
    console.log("Energy request id", enRequestId)

    // to make a bid on the selected energy request
    const handleBid = async () => {
        
        const userToken = await authToken.readUserToken()
        console.log("Stored user token", userToken)

        let bid = {
            BidID: 'BD ',           
            UserID: userToken.userId,        
            UserPrice: parseFloat( (0.2 * bidAmount) ),
            UserEnergy: parseFloat(bidAmount),    
            Prosumer_or_EV : 'SH',
            Buyer_or_Seller: 'Sell',  // buyer since making enery request
            Time: '',
            EnRequestId : enRequestId
        }

        const response = await energyRequestApi.createBid(bid)
        console.log("SH Energy request response on the frontend side", response)
        if (response.Success){
            return (
                Alert.alert(
                    "Success",
                    "Bid made successfully. You will be redirected to market page",
                    [
                        {
                            text:"OK",
                            onPress :() => RootNavigation.navigate('Market')
                        }
                    ]
                )
            )
        }
        
    }


        return (
            <View style={styles.container}>
                <Text
                    style={styles.text}
                > 
                    {formHeader}</Text>
            
                
                <TextInput 
                    style = {styles.inputForm}
                    placeholder="Energy Amount (kWh)"
                    onChangeText={(value)=> setBidAmount(value)}
                />

                <Text style={styles.normalText}>Bid Amount: {bidAmount} kWh</Text>

                <View style={styles.cardBtn}>
                    <TouchableOpacity onPress= {() => handleBid()}>
                        <View>
                            <Text> Confirm </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                

            </View>
        )
    

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