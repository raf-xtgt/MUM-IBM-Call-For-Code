import { StyleSheet, View, Text} from 'react-native';
// custom components
import {LinearGradient} from 'expo-linear-gradient';
import SignUp from '../../components/SignUp/SignUp';
import WelcomeScreen from '../WelcomeScreen';
import React, {useState, useEffect} from "react";

export default function SignUpScreen(){
    
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userDetails, setUserDetails] = useState({})

    if (isLoggedIn){
        return (
            <WelcomeScreen />
        )
    }
    else{
        return(
            <LinearGradient colors={['#EBEDEC', '#0F3443']}
            style={styles.container}>
                
                <View>
                    <SignUp />
                
                </View>    
    
            </LinearGradient>
                
        )
    }
    

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      //backgroundColor: '#1F1C3F',
    },
  });