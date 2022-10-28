import { StyleSheet, View, Text, FlatList} from 'react-native';
//custom components
import MarketCard from './MarketCard';
import { elevation } from '../../styles/styles';
import Form from '../../Forms/Forms';

export default function Market ({cardList, setFeature, activeTerm}) {
    return (
        <View style={[styles.container, elevation]}>
            <Text style={styles.header}> Market </Text>
            <View style={styles.cardContainer}>
                
                <MarketCard 
                    name={"EV Charging"}
                    active={false}
                    handlePress=
                    {
                        ()=> setFeature("EV Charging")  
                    }
                />

                <MarketCard 
                    name={"Make a bid"}
                    active={false}
                    handlePress=
                    {
                        ()=> setFeature("Sell Energy")  
                    }
                />

            </View>
            

           
            <Form  
                style={styles.formContainer}
                chosenFeature={activeTerm}
            />

        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        backgroundColor:"#00FA7B",
        
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
    }

    


})