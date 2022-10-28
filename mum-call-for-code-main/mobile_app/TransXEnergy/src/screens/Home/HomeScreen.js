import { StyleSheet, View, Text} from 'react-native';
import { useState } from 'react';

export default function HomeScreen(){
    const [feature, setFeature] = useState("EV Charging")
    const cardCategories = [
        {
            name: "EV Charging"
        },
        {
            name: "Sell Energy" 
        },
    ]

    return(
        <View style={styles.container}>
            <Text>Home Screen</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#466D1D',
    },
  });
