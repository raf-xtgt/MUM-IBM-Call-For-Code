import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { elevation } from "../styles/styles";
import * as RootNavigation from '../../RootNavigation'

export default function OpenRequestCard({request, elapsedTime}){

    const [time, setTime] = useState(0)
    const options = 
    {
        buyerName:'buyer1', 
        energyAmount: request.amount, 
        energyPrice: request.price, 
        bidderName: 'bidder1', 
        bidderFiatBalance: '5400', 
        bidderEnergyBalance: '30000', 
        requestData:request
    } 

    // runs the customer matching every 30 mins
    useEffect(() => {
        const interval = setInterval(async () => {
            setTime( (time) => time + 1 )
        }, 60 * 1000);
    
        return () => clearInterval(interval);
        }, []);

    return(
        <TouchableOpacity onPress={() => RootNavigation.navigate('Bid', options )}>


            <View style={[styles.elevation, styles.container]}>
                <Text style={[styles.info, styles.energyTxt]}> {request.UserEnergy} </Text>
                <Text style={[styles.info, styles.priceTxt]}> {Math.round((request.UserPrice + Number.EPSILON) * 100) / 100 } </Text>
                <Text style={[styles.info, styles.timeTxt]}> {request.Prosumer_or_EV} </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"white",
        height:50,
        //alignSelf:"stretch", // take up the horizontal space available on screen
        borderRadius:50,
        marginVertical:10,
        alignItems:"center", // center the child items vertically
        justifyContent:"center", // center the child items horizontally,   
        width:300,
        flexDirection:'row',
        backgroundColor:"#0F3443",
    


    },
    elevation,    

    info:{
        color:'white',
        //flexDirection:"row" // will put the rating and money side by side (horizontally)
    },
    energyTxt:{
        marginRight:50
    },
    priceTxt:{
        margin:'auto'
    },
    timeTxt:{
        marginLeft:50,
    },
    verticleLine: {
        height: '100%',
        width: 1,
        backgroundColor: '#909090',
      }
  
    



})