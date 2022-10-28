import React, {useState, useEffect} from "react";
import {View, TextInput, StyleSheet, Text, TouchableOpacity, Alert} from "react-native"
import loginApi from '../../middleware/login'
import * as RootNavigation from '../../../RootNavigation'
import authToken from '../../utils/userDataCaching'

export default function Login() {
    
    const [email, setEmail ] = useState('')
    const [password, setPassword ] = useState('')

    const handleUserLogin = async () => {
        let request = {
            "email": email,
            "password": password
        }

        const response = await loginApi.userLogin(request)
        // console.log("Login response on the frontend side", response.Success)
        console.log("Login response", response)
        await authToken.storeUserToken(response.Data)
        if (response.Success){
            return (
                Alert.alert(
                    "Success",
                    "Login was sucessful",
                    [
                        {
                            text:"OK",
                            onPress :() => RootNavigation.navigate('Home')
                        }
                    ]
                )
            )
        }
    }
    

    return(
        <View style={styles.container}>
                <Text   style={styles.text}> 
                    Login
                </Text>
                
                {/* Input parameters */}
                <TextInput
                    style = {styles.inputForm} 
                    placeholder="Email"
                    onChangeText={(value)=> setEmail(value)}
                />
                <TextInput
                    style = {styles.inputForm} 
                    placeholder="Password"
                    type="password"
                    secureTextEntry={true}
                    onChangeText={(value)=> setPassword(value)}  
                />
               


                {/* Confirmation button */}
                <View style={styles.cardBtn}>
                    <TouchableOpacity onPress= {() => handleUserLogin()}>
                        <View >
                            <Text> Confirm </Text>
                        </View>
                    </TouchableOpacity>
                </View>

        </View>
    )
}



const styles = StyleSheet.create({
    container:{
        marginHorizontal:30,
        marginTop:50,
        
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
        marginLeft:115,
        flexDirection:"row",
        color:"white",
        width:100,
        height:50,
        textAlign:"center",
        borderRadius:30,
        borderWidth:1.25,
        marginVertical:10,
        // marginHorizontal:75,
        borderColor:"black",
        // backgroundColor:"#98FB98",
        backgroundColor:"#24A0ED",
        alignItems:"center", // center the child items vertically
        justifyContent:"center", // center the child items horizontally,    
    },
    text:{
        textAlign:"center",
        fontWeight: "bold",
        fontSize: 20,
    
    }


  

})