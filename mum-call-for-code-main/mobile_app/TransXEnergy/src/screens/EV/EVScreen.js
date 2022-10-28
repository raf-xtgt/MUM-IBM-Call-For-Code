import { StyleSheet, View, Text} from 'react-native';
import { useState } from 'react';
// custom components
import EV from '../../components/EV/EV';
import {LinearGradient} from 'expo-linear-gradient';
import StackedBarChart from '../../components/BarChart/StackedBarChart';


export default function EVScreen(){
    const [feature, setFeature] = useState("EV Charging")
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
    
    return(


        <LinearGradient
                colors={['#34E89E', '#0F3443']}
                style={styles.container}>
             
             <View style={styles.container}>
                    
                
                <EV 
                    setFeature={setFeature}
                    activeTerm={feature}
                />
                

                 {/* Stacked bar chart showing consumption history */}
                <StackedBarChart 
                    dataPoints={chartData}
                    title={"Order History"}
                />     


            </View>        

        </LinearGradient>

        
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      //backgroundColor: '#1F1C3F',
    },
  });
