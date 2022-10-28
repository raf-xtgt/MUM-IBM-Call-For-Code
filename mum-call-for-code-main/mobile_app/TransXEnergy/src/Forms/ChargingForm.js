import React, {useState} from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity} from 'react-native';
import Slider from '@react-native-community/slider';
import energyRequestApi from '../middleware/energyRequests'
import authToken from '../utils/userDataCaching'

export default function ChargingForm({}){
    const [sliderValue, setSliderValue] = useState(2);
    const chargingRate = 10 // the charging station can charge for 10kW per hr


     // to make energy request from EVs
     const handleEVRequest = async () => {
        
        const userToken = await authToken.readUserToken()
        console.log("Stored user token", userToken)

        let energyRequest = {
            BidID: 'BD ',           
            UserID: userToken.userId,        
            UserPrice: Math.round(( (0.2 * sliderValue * chargingRate)+ Number.EPSILON) * 100) / 100 ,
            UserEnergy: Math.round(( (sliderValue*chargingRate) + Number.EPSILON) * 100) / 100, 
            Prosumer_or_EV : 'EV',
            Buyer_or_Seller: 'Buy',  // buyer since making enery request
            Processed: false
        }

        const response = await energyRequestApi.createEnergyRequest(energyRequest)
        // console.log("SH Energy request response on the frontend side", response)
        if (response.Success){
            return (
                Alert.alert(
                    "Success",
                    "Electric Vehicle Energy Request Successful ",
                    [{text:"OK",}]
                )
            )
        }
        
    }

        return (
            <View style={styles.container}>
                <Text
                    style={styles.text}
                > 
                    Order Energy for EV Charging</Text>

                {/*Slider with max, min, step and initial value*/}
                <Text style={styles.normalTxt}> Select Time </Text>
                <Slider
                    maximumValue={12}
                    minimumValue={1}
                    minimumTrackTintColor="#307ecc"
                    maximumTrackTintColor="#000000"
                    step={0.5}
                    value={sliderValue}
                    onValueChange={
                        (sliderValue) => setSliderValue(sliderValue)
                    }
                />
                 <Text style={styles.normalTxt}> Charging Time: {sliderValue} hrs</Text>
                
                {/* <TextInput 
                    style = {styles.inputForm}
                    placeholder="Required amount (kWh)"
                /> */}

                <View style={styles.cardBtn}>
                    <TouchableOpacity onPress= {() => handleEVRequest()} >
                        <View >
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
        backgroundColor:"#24A0ED",
        alignItems:"center", // center the child items vertically
        justifyContent:"center", // center the child items horizontally,    
    },
    text:{
        textAlign:"center",
        fontWeight: "bold",
        fontSize: 20,
        color:'white',
        marginBottom:10,
    },
    normalTxt:{
        color:'white',
        fontSize:15,
        textAlign:'center'
    }


  

})