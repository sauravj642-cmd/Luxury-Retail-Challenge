import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import ResultScreen from '../screens/ResultScreen';
import MyLooksScreen from '../screens/MyLooksScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="MyLooks" component={MyLooksScreen} />
    </Tab.Navigator>
  );
}

function AuthLoadingScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const hasPhotos = (await AsyncStorage.getItem('hasPhotos')) === 'true';
        if (token) {
          if (hasPhotos) {
            navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
          } else {
            navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
          }
        } else {
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  return null;
}

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="AuthLoading">
      <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ title: 'Upload Your Photos' }} />
      <Stack.Screen name="MainApp" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Scan" component={ScanScreen} options={{ title: 'Scan Garment' }} />
      <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Your Virtual Look' }} />
    </Stack.Navigator>
  );
}


