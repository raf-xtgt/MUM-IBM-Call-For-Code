import React, {useState, useEffect} from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, Image} from 'react-native';
import * as RootNavigation from '../../../RootNavigation'
import signUpApi from '../../middleware/signUp'
import authToken from '../../utils/userDataCaching'


export default function SignUp (){

    // fields for the user sign up
    const [email, setEmail ] = useState('')
    const [password, setPassword ] = useState('')
    const [address, setAddress ] = useState('')
    const [smartMeterNo, setSmartMeterNo ] = useState('')
    const [icnum, setIcNum ] = useState('')

    const checkToken = async () => {
        const userToken = await authToken.readUserToken()
        console.log("Stored user token", userToken)
        if (userToken!=null){
            RootNavigation.navigate('Login')
        }
    }
     
    // useEffect( async () => {
    //     await checkToken()
    // }, [])



    const handleUserSignUp = async () => {
        
        let data = {
            "userId":"",
            "email":email,
            "password":password,
            "address":address,
            "smartMeterNo":smartMeterNo,
            "type":"Normal",
            "icNum":icnum,
            "moneyBalance":10000,
            "energyBalance":2500,
        }

        const response = await signUpApi.userSignUp(data)
        console.log("On the frontend side", response.Success)
        if (response.Success){
            return (
                Alert.alert(
                    "Success",
                    "You have successfully signed up",
                    [
                        {
                            text:"OK",
                            onPress :() => RootNavigation.navigate('Login')
                        }
                    ]
                )
            )
        }
    }


    return(
        <View style={styles.container}>

                <Text   style={styles.text}> 
                    Sign Up
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
                    secureTextEntry={true}
                    type="password"
                    onChangeText={(value)=> setPassword(value)}  
                    // onChangeText={(value)=> setOrderedAmount(value)}

                />
                <TextInput
                    style = {styles.inputForm} 
                    placeholder="Address"
                    onChangeText={(value)=> setAddress(value)}  
                    // onChangeText={(value)=> setOrderedAmount(value)}

                />
                <TextInput
                    style = {styles.inputForm} 
                    placeholder="Smart Meter No."
                    onChangeText={(value)=> setSmartMeterNo(value)}  
                    // onChangeText={(value)=> setOrderedAmount(value)}

                />
                <TextInput
                    style = {styles.inputForm} 
                    placeholder="IC Number"
                    onChangeText={(value)=> setIcNum(value)}  
                   
                />


                {/* Confirmation button */}
                <View style={styles.cardBtn}>
                    <TouchableOpacity onPress= {() => handleUserSignUp()} >
                        <View >
                            <Text> Confirm </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Redirect to login */}
                <View >
                    <Text> Already have an account? </Text>
                    <TouchableOpacity onPress={() => RootNavigation.navigate('Login')}>
                        <View >
                            <Text> Click here to login </Text>
                        </View>
                    </TouchableOpacity>
                </View>

        </View>
    )
}



const styles = StyleSheet.create({
    container:{
        marginTop:50,
        marginHorizontal:30,
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
        borderWidth:1.5,
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