import { StyleSheet, View, Text, ScrollView} from 'react-native';
//custom components
import { elevation } from '../../styles/styles';
import { useState, useEffect } from 'react';
import StackedBarChart from '../BarChart/StackedBarChart';
import BarGraph from '../BarChart/BarChart';
import TradingForm from '../../Forms/TradingForm';
import predictions from '../../hooks/getPredictions';

// to send energy requests
import sendEnergyRequest from '../../middleware/config'

export default function SmartHome () {
    
    // needs to come from backend
    const stackedBarChartData = [
        {
          stacks: [
            {value: 10, color: '#EEA47FFF'},
            {value: 20, color: '#00539CFF', marginBottom: 2},
          ],
          label: '8:30AM',

        },
        {
          stacks: [
        
            {value: 11, color: '#EEA47FFF', marginBottom: 2},
            {value: 15, color: '#00539CFF', marginBottom: 2},
          ],
          label: '8:40AM',
    
        },
        {
          stacks: [
            {value: 14, color: '#EEA47FFF'},
            {value: 18, color: '#00539CFF', marginBottom: 2},
          ],
          label: '8:50AM',
    
        },
        {
          stacks: [
            {value: 11, color: '#EEA47FFF', marginBottom: 2},
            {value: 10, color: '#00539CFF', marginBottom: 2},
          ],
          label: '8:55AM',

        },
      ];
      const [chartData, setBarChartData] = useState(stackedBarChartData)

      // get the energy request hook --> sendEnergyRequest is how we import the hook that implements addEnergyRequest() function
      const [{energyRequest}, addEnergyRequest ] = sendEnergyRequest()
      const dummyEnergyData = {
        data:'this is dummy energy request'
      }

    // to get the energy predictions 
      const [{data, loading, error}, getEnergyPredictions] = predictions()

    useEffect( () => {
      getEnergyPredictions('Consumption')
    }, ['consumption'] )

    useEffect( () => {
      addEnergyRequest(dummyEnergyData)
    }, [] )

    return (
        <ScrollView >

          {/* Show energy Prediction */}
          <View>
            <BarGraph 
              dataPoints={data}
              title={'Predicted Energy Consumption'}
              legendLabel={'Energy in kWh'}
              barColor = {'#177AD5'}
              type={'Consumption'}
            />

          </View>

          {/* Buy energy form */}
          <View style={[styles.container, elevation]}>
            <TradingForm  
                    style={styles.formContainer}
                    chosenFeature={"Order Energy"}
                    formHeader = {'Order Energy for your home'}
                />
          </View>

          {/* Stacked bar chart showing consumption history */}
          <StackedBarChart 
            dataPoints={chartData}
            title={"Order History"}
          />            
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container:{
        backgroundColor:"#0F3443",
        
        alignSelf:"stretch", // take up the horizontal space available on screen
        borderRadius:50,
        //paddingVertical:30,
        marginHorizontal:10,
        alignItems:"center", // center the child items vertically
        justifyContent:"center", // center the child items horizontally,
        
    },

    cardContainer:{
        flexDirection:"row",
    },

    elevation,
    formContainer:{
        fontWeight:"bold",
        flexDirection:"column"
    },
    cards:{
        flexDirection:"row"
    }

    


})