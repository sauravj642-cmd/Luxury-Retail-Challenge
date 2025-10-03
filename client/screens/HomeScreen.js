import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 22, marginBottom: 16 }}>StyleScan</Text>
      <Button title="Scan Garment QR Code" onPress={() => navigation.navigate('Scan')} />
    </View>
  );
}


