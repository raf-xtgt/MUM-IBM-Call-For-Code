import { StyleSheet, View, Text} from 'react-native';
// custom components
import {LinearGradient} from 'expo-linear-gradient';
import TradingForm from '../../Forms/TradingForm';


export default function MarketScreen(){
    

    return(
        <LinearGradient
                colors={['#EBEDEC', '#0F3443']}
                style={styles.container}>
            
            <View>
                <TradingForm  
                    style={styles.formContainer}
                    chosenFeature={"Make a bid"}
                />

            </View>    

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
