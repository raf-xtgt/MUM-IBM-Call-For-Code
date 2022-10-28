
// HOW TO USE IMAGES

import { Text, View, StyleSheet, Image } from "react-native"
import { elevation } from "../../styles/styles"

export default function MarketCard() {
    return (
        <View style={[styles.container, styles.elevation]}>
            
            <Text>
                EV Charging
            </Text>

        <View style={styles.imageContainer}>
            <Image 
                source = {require("../../assets/images/EV_Charging.png")}
                style = {styles.image}
            />

        </View>
            
            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:150,
        height:50,
        borderRadius: 50,
        marginVertical: 15,
        marginHorizontal:35,
        backgroundColor:"#00FA7B",
        alignItems:"center", // center the child items vertically
        justifyContent:"center", // center the child items horizontally,
        flexDirection:"row"
    },
    elevation,

    // height and width only for the image
    image:{
        width:35,
        height:35
    },

    // to house the image
    imageContainer:{
        width:45,
        height:45,
        backgroundColor:"white",
        alignItems:"center",
        justifyContent:"center",
        borderRadius: 50,
        marginBottom:5
    },

})