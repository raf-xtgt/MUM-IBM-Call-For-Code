import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import { elevation } from "../styles/styles";
import * as RootNavigation from '../../RootNavigation'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function BlockCard({request}){

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





    return(
        <TouchableOpacity>


            <View style={[styles.elevation, styles.container]}>
                <Text style={[styles.info, styles.energyTxt]}> {request.Index}  </Text>
                <Text style={[styles.info, styles.priceTxt]}>  {request.Hash.slice(0, 5)}... </Text>
                <Text style={[styles.info, styles.timeTxt]}>  {request.PrevHash.slice(0, 5)}... </Text>
                
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
    },
    iconStyle:{
        marginTop:5,
        marginLeft:2,
        backgroundColor:'white',
        color:'white',
        borderRadius:30,

    }
  
    



})