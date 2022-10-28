import React, { useState, useEffect } from 'react';
import { RefreshControl, FlatList, StyleSheet, ScrollView, View, Text, TouchableOpacity } from "react-native";
import OpenRequestCard from "./OpenRequestCard";
import energyRequests from '../hooks/getEnergyRequests'
import Ionicons from 'react-native-vector-icons/Ionicons';
import customerMatchingApi from '../middleware/customerMatching'
import blockchainApi from '../middleware/blockchain'

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function OpenRequests({}){

    
    const [refreshing, setRefreshing] = useState(false);
    const [openRequests, getAllEnergyRequests ] = energyRequests()
    let data = {}

    useEffect( () => {
        getAllEnergyRequests()
      }, [] )


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
        wait(2000).then(() => getAllEnergyRequests());

    }, []);

    // run customer matching
    const runCM = async () => {
        
        let data = {
            d: 'runCM'
        }

        const response = await customerMatchingApi.getCMData(data)
        // console.log("CM response on the frontend side", response)
        const allRequests = response.Data
        //console.log("CM response on the frontend side", allRequests)
        const cm = await customerMatchingApi.runCM(allRequests)
        //console.log("Blockchain", cm)
        let blockchain = {
            data:cm
        }
        // write the blockchain to the database
        const writeResponse = await blockchainApi.writeBlockchain(blockchain)
        console.log("After writing blockchain", writeResponse)
    }
    
    return (
        
            <ScrollView  style={styles.container} 
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
            <Text style={styles.text}> 
                Bid on Energy Requests
                {/* <TouchableOpacity style={styles.iconStyle}>
                    <Ionicons
                        name="sync-circle"
                        size={24}
                    />
                </TouchableOpacity> */}
                
            </Text>
            
            <View style={styles.listHeader}>
                <Text style={styles.headerText}> Energy (kWh) </Text>
                <Text style={styles.headerText}> Price (RM) </Text>
                <Text style={styles.headerText}> Elapsed Time </Text>
            </View>

            
            
            <FlatList
                   data={openRequests.data.Data}
                   keyExtractor={(request) => request.requestId} 
                   renderItem=
                    {
                        ({item}) => (<OpenRequestCard request={item}/>)
                    }
            />

            <TouchableOpacity style={styles.iconStyle}
                onPress= {() => runCM()}
            >
                <Ionicons
                    name="sync-circle"
                    size={36}
                />
            </TouchableOpacity>
        </ScrollView>

        
    )
}


const styles = StyleSheet.create({
    container:{
        // alignSelf:"stretch",
        //flexDirection:"row",
        //marginVertical:100,
        flex:1, // this here is needed for scrolling !!!
        height:300,
        width:'100%'
    },
    text:{
        textAlign:"center",
        fontWeight: "bold",
        fontSize: 20,
    
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
        color:'white'
    },
    verticleLine: {
        height: '100%',
        width: 1,
        backgroundColor: '#909090',
      },
    iconStyle:{
        marginTop:10,
        marginLeft:5
    }
   
})

