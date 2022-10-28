import { StyleSheet, View, Text, TextInput, TouchableOpacity} from 'react-native';
import OpenRequests from './OpenRequests';

export default function Form({chosenFeature}){


    if (chosenFeature=="EV Charging") {
        return (
            <View style={styles.container}>
                <Text
                    style={styles.text}
                > 
                    Order Energy for EV Charging</Text>
                
                <TextInput
                    style = {styles.inputForm} 
                    placeholder="Charging time (hrs)"
                />
                
                <TextInput 
                    style = {styles.inputForm}
                    placeholder="Required amount (kWh)"
                />

                <View style={styles.cardBtn}>
                    <TouchableOpacity >
                        <View >
                            <Text> Confirm </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                

            </View>
        )
    }
    else if (chosenFeature=="Sell Energy") {
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
        backgroundColor:"#98FB98",
        alignItems:"center", // center the child items vertically
        justifyContent:"center", // center the child items horizontally,    
    },
    text:{
        textAlign:"center",
        fontWeight: "bold",
        fontSize: 20,
    
    }


  

})