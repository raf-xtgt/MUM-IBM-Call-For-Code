import { StyleSheet, View, Text, ActivityIndicator, FlatList } from 'react-native';
import useRestaurants from '../../hooks/useRestaurants';
//useEffect --> a built in hook that will allow us to call our function once upon the render of the component
import {useEffect} from "react"
import RestaurantItem from './RestaurantItem';

export default function Restaurants({term}) {
    
    const [{data, loading, error}, searchRestaurants] = useRestaurants()
    
    // if the dependency array is empty then it runs once and once only.
    // if it has a prop inside, then it runs once whenever the prop is changed.
    useEffect( () => {
        searchRestaurants(term)
    }, [term])

    if (loading) return (<ActivityIndicator size="large" marginVertical={30}/>)
    if (error) 
        return (
            <View style={styles.container}>
                <Text style={styles.header}>
                    {error}
                </Text>
            </View>    
        )

    return(
        <View style={styles.container}>
            <Text style={styles.header}>
                Top Restaurants
            </Text>
            
                <FlatList 
                    data={data}
                    keyExtractor={(restaurant) => restaurant.id} 
                    renderItem={({item}) => 
                        <RestaurantItem restaurant={item}/>
                        
                }
                />
            
            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        marginHorizontal: 15,
        marginVertical: 5,
        flex:1 // this here is needed for scrolling !!!
        
    },
    header:{
        fontWeight: "bold",
        fontSize: 20,
        paddingBottom:10,
    }
})