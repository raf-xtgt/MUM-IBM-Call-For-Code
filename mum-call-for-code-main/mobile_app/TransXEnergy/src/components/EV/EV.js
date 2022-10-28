import { StyleSheet, View, ScrollView} from 'react-native';
//custom components
import { elevation } from '../../styles/styles';
import ChargingForm from '../../Forms/ChargingForm';
import StackedBarChart from '../BarChart/StackedBarChart';
import { useState } from 'react';

export default function EV ({activeTerm}) {

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


    return (
        <ScrollView style={styles.mainContainer}>

            <View style={[styles.container, elevation]}>
                <ChargingForm  
                    style={styles.formContainer}
                /> 
            </View>

            <View style={[styles.graphContainer, elevation]}>
              {/* Stacked bar chart showing consumption history */}
            <StackedBarChart 
                dataPoints={chartData}
                title={"Order History"}
            />
            </View>
                
        </ScrollView>

    )
}


const styles = StyleSheet.create({

  mainContainer:{
    marginTop:20
  },

  graphContainer:{
    paddingVertical:10,
        marginVertical: 20,
        alignSelf:"stretch", // take up the horizontal space available on screen
        borderRadius:50,
        //paddingVertical:30,
        marginHorizontal:10,
        alignItems:"center", // center the child items vertically
        justifyContent:"center", // center the child items horizontally,

  },

    container:{
        backgroundColor:"#0F3443",
        paddingVertical:10,
        marginVertical: 20,
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
    header:{
        fontWeight: "bold",
        fontSize: 30,
        paddingBottom:10,
    },
    elevation,
    formContainer:{
        fontWeight:"bold",
        flexDirection:"column"
    },
    cards:{
        flexDirection:"row"
    },
    backBtn:{
        color:"white"
    }

    


})