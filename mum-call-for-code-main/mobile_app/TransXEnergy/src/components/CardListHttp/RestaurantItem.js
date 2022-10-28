import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import elevation from '../../styles/styles'
import {withNavigation} from "react-navigation"

function RestaurantItem({restaurant, navigation}) {
    return (
        <TouchableOpacity
        // navigate to restaurant screen and pass the parameters in there
            onPress={() => navigation.navigate("Restaurant", {id: restaurant.id})}
        >
            <View style={[styles.elevation, styles.container]}>
             
                {/* Image representing the restaurant */}
                <Image style={styles.image} source={{uri: restaurant.image_url}}/>
                <View style={styles.infoContainer}>
                    {/* Restaurant name */}
                    <Text style={styles.header}>{restaurant.name}</Text>
                    
                    {/* To house the restaurant rating and price */}
                    <View style={styles.info}>
    
                        {/* Rating */}
                        <Text style={styles.rating}> {restaurant.rating} </Text>
    
                        {/* Price */}
                        <Text style={styles.money}>{restaurant.price}</Text>
    
                    </View>
    
                </View>
            </View>
        </TouchableOpacity>
        
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"white",
        height:100,
        alignSelf:"stretch", // take up the horizontal space available on screen
        borderRadius:50,
        marginVertical:10,
        flexDirection:"row",
        alignItems:"center"

    },
    elevation,
    image:{
        width:75,
        height: 75,
        borderRadius: 50,
        marginLeft: 10
    },

    infoContainer:{
        flex:1,
        paddingHorizontal:10,
    },

    header:{
        fontSize:18,
        fontWeight:"bold",
        marginBottom:4
    },

    info:{
        flexDirection:"row" // will put the rating and money side by side (horizontally)
    },

    rating:{
        marginRight:20,
    },

    money:{
        color:"gold"
    }



})

export default withNavigation(RestaurantItem);