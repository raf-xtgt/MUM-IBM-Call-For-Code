import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button,  TouchableOpacity} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import EV from '../../components/EV/EV';
import * as RootNavigation from '../../../RootNavigation'

export default function Scanner(){
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [feature, setFeature] = useState("EV Charging")

    useEffect(() => {
        (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);

    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    if (scanned===true){
        // RootNavigation.navigate('EVComponent')
        return (<EV 
            setFeature={setFeature}
            activeTerm={feature}
        />)
        
    }

    return(
        <View style={styles.container}>
            <Text>
                Scan QR Code To Get Started
            </Text>
            <BarCodeScanner 
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFill}
            />
            {scanned && 
                <Button 
                    title={'Tap to Scan Again'}
                    onPress= {() => setScanned(false)}
                />
            }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
    },
  });