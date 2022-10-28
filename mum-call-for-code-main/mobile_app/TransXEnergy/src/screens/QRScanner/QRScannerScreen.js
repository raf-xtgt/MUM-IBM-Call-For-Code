import { StyleSheet, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Scanner from '../../components/QRScanner/QRScanner';


export default function QRScannerScreen(){

    return(


        <LinearGradient
                colors={['#EBEDEC', '#0F3443']}
                style={styles.container}>
             
             <View style={styles.container}>
                    
                <Scanner />
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
