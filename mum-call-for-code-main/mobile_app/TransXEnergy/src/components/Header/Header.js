import {Text, View, StyleSheet} from "react-native"

export default function Header(){
    return (
        <View>
            <Text style={styles.mainHeader}>TransXEnergy</Text>
            <Text style={styles.subHeader}> Energy Trading between Smart Homes & Electric Vehicles</Text>
            
        </View>
    );
}


const styles = StyleSheet.create({
    mainHeader: {
        fontSize:35,
        marginTop:70,
        textAlign:"center"
    },

    subHeader: {
        fontSize:15,
        marginTop:20,
        marginHorizontal:50,
        textAlign:"center"
    }
})