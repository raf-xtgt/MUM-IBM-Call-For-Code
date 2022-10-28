import WelcomeScreen from "./src/screens/WelcomeScreen";
import EVScreen from "./src/screens/EV/EVScreen";
import SmartHomeScreen from "./src/screens/SmartHome/SmartHomeScreen";
import MarketScreen from "./src/screens/Market/MarketScreen";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {navigationRef} from './RootNavigation'
import BidScreen from "./src/screens/Bid/BidScreen";
import QRScannerScreen from "./src/screens/QRScanner/QRScannerScreen";
import LoginScreen from "./src/screens/Login/LoginScreen";
import SignUpScreen from "./src/screens/SignUp/SignUpScreen";
import {View} from "react-native";

  const Tab = createBottomTabNavigator();

  export default function Tabs(){
    
    return(
      <NavigationContainer ref={navigationRef}>
        {/* Redirect to sign up page by default */}
        <Tab.Navigator initialRouteName="SignUp" component={SignUpScreen} screenOptions={{headerShown:false}}>


            <Tab.Screen name="Home" component={WelcomeScreen}
              
              options={{
                tabBarIcon: (tabInfo) => {
                  return (
                    <Ionicons
                      name="md-home"
                      size={24}
                      color={tabInfo.focused ? "#0F3443" : "#8e8e93"}
                    />
                  );
                },
                // tabBarStyle:{display:'none'}
              }}
            />

            <Tab.Screen name="EV" component={QRScannerScreen} 
               options={{
                tabBarIcon: (tabInfo) => {
                  return (
                    <Ionicons
                      name="car"
                      size={24}
                      color={tabInfo.focused ? "#0F3443" : "#8e8e93"}
                    />
                  );
                },
              }}
            />


            <Tab.Screen name="Smart Home" component={SmartHomeScreen} 
               options={{
                tabBarIcon: (tabInfo) => {
                  return (
                    <Ionicons
                      name="home"
                      size={24}
                      color={tabInfo.focused ? "#0F3443" : "#8e8e93"}
                    />
                  );
                },
              }}
            />

            <Tab.Screen name="Market" component={MarketScreen} 
               options={{
                tabBarIcon: (tabInfo) => {
                  return (
                    <Ionicons
                      name="list"
                      size={24}
                      color={tabInfo.focused ? "#0F3443": "#8e8e93"}
                    />
                  );
                },
              }}
            />

            {/* Navigation of hidden components are shown here */}

            <Tab.Screen name="Bid" component={BidScreen} 
            
            options=
            {{
              tabBarButton: () => (
                  <View style={{width:0, height:0}}></View>
              ),
              tabBarVisible:false //hide tab bar on this screen
      
            }}/>


        <Tab.Screen name="Scan" component={QRScannerScreen} 
            
            options=
            {{
              tabBarButton: () => (
                  <View style={{width:0, height:0}}></View>
              ),
              tabBarVisible:false //hide tab bar on this screen
      
            }}/>

        
          <Tab.Screen name="Login" component={LoginScreen} 
            
            options=
            {{
              tabBarButton: () => (
                  <View style={{width:0, height:0}}></View>
              ),
              tabBarVisible:false, //hide tab bar on this screen
              tabBarStyle:{display:'none'},
      
            }}/>



          <Tab.Screen name="SignUp" component={SignUpScreen}
            options=
              {{
                tabBarButton: () => (
                    <View style={{width:0, height:0}}></View>
                ),
                tabBarStyle:{display:'none'},
                tabBarVisible:false
              }}
          />

        
            
        </Tab.Navigator>
      </NavigationContainer>
      
    )
  }
