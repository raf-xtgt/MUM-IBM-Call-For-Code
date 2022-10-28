import { StyleSheet, View, Text} from 'react-native';
// custom components
import {LinearGradient} from 'expo-linear-gradient';
import Login from '../../components/Login/Login';

export default function LoginScreen(){
    

    return(
        <LinearGradient colors={['#EBEDEC', '#0F3443']}
        style={styles.container}>
            
            <View>
                <Login />
            
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