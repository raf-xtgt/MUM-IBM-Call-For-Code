import { StyleSheet} from 'react-native';
import { useState } from 'react';
// custom components
import SmartHome from '../../components/SmartHome/SmartHome';
import {LinearGradient} from 'expo-linear-gradient';


export default function SmartHomeScreen(){
    const [feature, setFeature] = useState("Order Energy")
    const cardCategories = [
        {
            name: "Order Energy"
        },
        {
            name: "Sell Energy" 
        },
    ]

    return(
        <LinearGradient
                colors={['#EBEDEC', '#0F3443']}
                style={styles.container}>
            
            
                <SmartHome/> 
            
            </LinearGradient>
            
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop:25,
      //backgroundColor: '#466D1D',
      alignItems:"center", // center the child items vertically
      justifyContent:"center", // center the child items horizontally,
    },
  });
