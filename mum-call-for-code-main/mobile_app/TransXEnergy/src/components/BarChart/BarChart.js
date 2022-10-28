import { StyleSheet, View, Text} from 'react-native';
import { elevation } from '../../styles/styles';
import { BarChart } from "react-native-gifted-charts";

export default function BarGraph ({dataPoints, title, legendLabel, barColor, type}) {



    return (
        <View style={[styles.container, elevation]}>

            <Text style={styles.text}>{title}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', margin:5}}>
               
                
                <View
                  style={{
                    height: 12,
                    width: 12,
                    borderRadius: 6,
                    backgroundColor: '#177AD5',
                    marginRight: 8,
                  }}
                />
                <Text
                  style={styles.legend}>
                  {legendLabel}
                </Text>
              </View>
            
            <BarChart
              width={270}
              frontColor={barColor}
              barWidth={12}
              spacing={90}
              noOfSections={4}
              barBorderRadius={6}
              data={dataPoints}
              xAxisLabelTexts={['Time in 24hr format']}
              style={[styles.chart]}
            />
        
        </View>
    )
}


const styles = StyleSheet.create({
    container:{

        backgroundColor:"#EBEDEC",
        paddingVertical:10,
        marginVertical: 20,
        alignSelf:"stretch", // take up the horizontal space available on screen
        borderRadius:50,
        //paddingVertical:30,
        marginHorizontal:10,
        alignItems:"center", // center the child items vertically
        justifyContent:"center", // center the child items horizontally,
        width:350,
        height:360,

        
    },
    elevation,
    text:{
        textAlign:"center",
        fontWeight: "bold",
        fontSize: 20,
        color:'black'
    
    },
    legend:{
        width: 100,
        height: 20,
        color: 'black',
    }

})
