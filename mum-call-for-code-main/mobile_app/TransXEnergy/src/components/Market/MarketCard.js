import { Text, View, StyleSheet, TouchableOpacity } from "react-native"
import { elevation } from "../../styles/styles"

export default function MarketCard({name, active, handlePress}) {
    return (

        <TouchableOpacity onPress={handlePress}>
            <View style={
                [
                    styles.container, 
                    styles.elevation,
                    active ? {backgroundColor:"rgb(241, 186, 87)"} : {backgroundColor:"#2E8B57"}
                ]
            }>
            
                <Text style={styles.cardLabel}>
                    {name}
                </Text>
            </View>
        </TouchableOpacity>
        
    )
}

const styles = StyleSheet.create({
    container:{
        width:150,
        height:50,
        borderRadius: 50,
        marginVertical: 15,
        marginHorizontal:18,
              
        alignItems:"center", // center the child items vertically
        justifyContent:"center", // center the child items horizontally,
        flexDirection:"row"
    },
    

   cardLabel:{
    fontWeight:"bold"
   }

})