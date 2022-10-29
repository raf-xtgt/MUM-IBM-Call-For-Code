import { StyleSheet, Text, View, ScrollView} from 'react-native';
import { useState, useEffect } from 'react';
// custom components
import {LinearGradient} from 'expo-linear-gradient';
import BarGraph from '../../components/BarChart/BarChart';
import BiDirectionalGraph from '../../components/BarChart/BiDirectionalBarChart';
import getPredictions from '../../hooks/getPredictions';
import { elevation } from '../../styles/styles';
import BiddingForm from '../../Forms/BiddingForm';

export default function BidScreen({route}){

    // to show transaction history
    // needs to come from backend
    const stackedBarChartData = [
      {
          value: -10,        
          label: '8:30AM',
          frontColor:'#EEA47FFF'
      },

      {
        value: 10,        
        label: '9:30AM',
        frontColor:'#00539CFF'
      },

      {
        value: -10,        
        label: '11:30AM',
        frontColor:'#EEA47FFF'
      },

      {
        value: 10,        
        label: '4:30PM',
        frontColor:'#00539CFF'
      },
      
    ];
  

    // get the paramaeters that have been passed 
    const { bidderFiatBalance, bidderEnergyBalance } = route.params;
    const energyAmount = route.params.requestData.UserEnergy;
    const energyPrice = route.params.requestData.UserPrice;
    const requestId = route.params.requestData.requestId
    console.log(route.params)
     // to get the energy predictions 
     const [{data, loading, error}, getEnergyPredictions] = getPredictions()

     useEffect( () => {
       getEnergyPredictions('Consumption')
     }, ['consumption'] )

    return(
      <ScrollView>
          <LinearGradient
          colors={['#EBEDEC', '#0F3443']}
          style={styles.container}>
          
          <View style={[styles.textContainer]}>
                <Text style={styles.screenHeaderText}> Bid on Energy Requests</Text>
            </View>

          {/* Energy production prediction */}
          <View>
              <BarGraph 
                dataPoints={data}
                title={'Predicted Energy Production'}
                legendLabel={'Energy in kWh'}
                barColor = {'#177AD5'}
                type={'Production'}
              />
          </View>


          {/* Card to hold the buyer and bidder details */}
          <View style={styles.infoContainer}>


            {/* Buyer details */}

            <View>
              <Text style={styles.headerText}>Buyer Details</Text>
              <Text style={styles.details}>Energy Amoount: {energyAmount} </Text>
              <Text style={styles.details}>Fiat Amount: { Math.round((energyPrice + Number.EPSILON) * 100) / 100  }</Text>
            </View>

            {/* Bidder details */}

            <View style={styles.bidderSection}>
              <Text style={styles.headerText}>Bidder Details</Text>
              <Text style={styles.details}>Energy Balance: {bidderEnergyBalance} </Text>
              <Text style={styles.details}>Fiat Balance: {bidderFiatBalance}</Text>
            </View>


          </View>

          {/* Buy energy form */}
          <View style={[styles.infoContainer, elevation]}>
            <BiddingForm  
                    style={styles.infoContainer}
                    formHeader = {'Bid on energy request'}
                    enRequestId = {requestId}
                />
          </View>

          {/* Bidding history */}
          {/* Stacked bar chart showing consumption history */}

          <View style={styles.bidHistoryCard}>
            <BiDirectionalGraph 
              dataPoints={stackedBarChartData}
              title={'Bidding history'}
              legendLabel={'Sold to p2p (kWh)'}
              legendLabel2={'Lost to TNB (kWh)'}
              barColor = {'#177AD5'}
              type={'Production'}
            />    

          </View>
          
        </LinearGradient>

      </ScrollView>
        
            
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop:25,
      //backgroundColor: '#466D1D',
      alignItems:"center", // center the child items vertically
      //justifyContent:"center", // center the child items horizontally,
    },

    textContainer:{
      paddingVertical:10,
      marginVertical: 10,
      alignSelf:"stretch", // take up the horizontal space available on screen
      borderRadius:50,
      //paddingVertical:30,
      marginHorizontal:10,
      alignItems:"center", // center the child items vertically
      justifyContent:"center", // center the child items horizontally,
  
    },
    screenHeaderText:{
      fontSize:20,
      fontWeight:'bold',
      color:'black',
    
    },

    infoContainer:{
        backgroundColor:"#0F3443",
        paddingVertical:10,
        marginVertical: 20,
        alignSelf:"stretch", // take up the horizontal space available on screen
        borderRadius:20,
        //paddingVertical:30,
        marginHorizontal:10,
        //alignItems:"center", // center the child items vertically
        justifyContent:"space-evenly", // children spaced out horizontally with equal distances in between,
        flexDirection:"row", // elements are placed horizontally
    },
    headerText:{
      fontWeight: "bold",
      fontSize: 20,
      color:'white',
      paddingBottom:15,
    },
    details:{
      fontWeight: "bold",
      color:'white'
    },
    elevation,

    bidHistoryCard:{
      height:600,
    }
  });
