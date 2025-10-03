import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function ScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const onBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);
    try {
      // Assuming QR encodes a JSON or a URL with ?sku=...
      let sku = data;
      if (data.includes('sku=')) {
        const url = new URL(data);
        sku = url.searchParams.get('sku') || data;
      }
      navigation.navigate('Result', { productSku: sku });
    } catch (e) {
      Alert.alert('Invalid QR', 'Could not parse product SKU.');
      setScanned(false);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{ barcodeTypes: [BarCodeScanner.Constants.BarCodeType.qr] }}
        onBarcodeScanned={onBarCodeScanned}
      />
    </View>
  );
}


