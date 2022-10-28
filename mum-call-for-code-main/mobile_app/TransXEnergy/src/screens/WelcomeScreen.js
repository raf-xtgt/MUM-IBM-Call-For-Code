import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Image, TouchableOpacity, Text, ScrollView} from 'react-native';
import {withNavigation} from "react-navigation"
import {LinearGradient} from 'expo-linear-gradient';
import BlockCard from '../Forms/Block';
import blockchainApi from '../middleware/blockchain'

function WelcomeScreen({navigation}) {


    const [blockchain, setBlockchain] = useState([])

    useEffect( async () => {
        let data = await blockchainApi.getBlockchain()
        console.log("Retrieved blockchain data", data.Data)
        setBlockchain(data.Data)
      }, [] )




    // show the homepage if logged in #EBEDEC colors={['#34E89E', '#0F3443']}
        return(       
            <ScrollView>
                <LinearGradient
                    colors={['#EBEDEC', '#0F3443']}
                    style={styles.container}>

                    
                
                    <View style={styles.btnContainer}>
                        <Image  source = {require("../assets/images/Logo.png")}/>
                        {/* Intro text */}
                        <View>
                            <Text style={styles.infoText}>
                                Satisfy energy demands through optimal peer to peer trading.
                            </Text>
                        </View>
                            <TouchableOpacity 
                                style={styles.cardButton}
                                onPress={() => navigation.navigate("Smart Home")}>
                                <Text>Let's Go</Text>
                            </TouchableOpacity>
                    </View>


                    <View style={styles.blockChainSection}>
                        <Text style={styles.text}>Current Blockchain</Text>
                        <View style={styles.listHeader}>
                            <Text style={styles.headerText}> Index </Text>
                            <Text style={styles.headerText}> Hash  </Text>
                            <Text style={styles.headerText}> PrevHash </Text>
                            
                        </View>
                        <FlatList
                            data={blockchain}
                            keyExtractor={(request) => request.Index} 
                            renderItem=
                            {
                                ({item}) => (<BlockCard request={item}/>)
                            }
                        />
                    
                    </View>

                </LinearGradient>    
            </ScrollView>     
        )

    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      //backgroundColor: '#1F1C3F',
      alignItems:"center", // center the child items vertically
      justifyContent:"center", // center the child items horizontally,
    },

    cardButton:{
        width:100,
        height:50,
        borderWidth:1,
        borderRadius: 50,
        marginVertical: 10,  
        // backgroundColor:"#00FA7B",
        backgroundColor:"#24A0ED",
        alignItems:"center", // center the child items vertically
        justifyContent:"center", // center the child items horizontally,
    },
    btnContainer:{
        marginTop:500,
        alignItems:"center", // center the child items vertically
        justifyContent:"center", // center the child items horizontally,
    },
    

    listHeader:{
        flexDirection:'row',
        height:50,
        backgroundColor:"#0F3443",
        marginVertical:10,
        alignItems:"center", // center the child items vertically
        justifyContent:"center", // center the child items horizontally,   
        width:300,

    },
    headerText:{
        color:'white',
        marginHorizontal:25,
    },
    text:{
        textAlign:"center",
        fontWeight: "bold",
        fontSize: 20,
    },
    infoText:{
        textAlign:"center",
        width: 300, 
        fontSize:20,
        marginVertical:20
    },
    blockChainSection:{
        marginTop:20
    }

  });

  export default withNavigation(WelcomeScreen);