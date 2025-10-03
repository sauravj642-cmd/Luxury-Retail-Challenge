import React, { useState } from 'react';
import { View, Text, Button, Image, FlatList, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function OnboardingScreen({ navigation }) {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      selectionLimit: 10
    });
    if (!result.canceled) {
      const assets = result.assets || [];
      setImages((prev) => [...prev, ...assets.map((a) => a.uri)]);
    }
  };

  const upload = async () => {
    if (images.length < 5) {
      Alert.alert('Add more photos', 'Please upload at least 5 photos.');
      return;
    }
    setUploading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const form = new FormData();
      images.forEach((uri, idx) => {
        form.append('photos', {
          uri,
          name: `photo_${idx}.jpg`,
          type: 'image/jpeg'
        });
      });
      const res = await api.post('/api/user/upload-photos', form, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      await AsyncStorage.setItem('hasPhotos', 'true');
      // Persist userId if returned from any subsequent call is needed
      Alert.alert('Uploaded', 'Your photos were uploaded successfully.');
      navigation.replace('MainApp');
    } catch (e) {
      Alert.alert('Upload failed', 'Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>Upload at least 5 photos to personalize your try-ons.</Text>
      <Button title="Pick Photos" onPress={pickImages} />
      <FlatList
        data={images}
        keyExtractor={(u, i) => `${u}-${i}`}
        numColumns={3}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={{ width: '30%', aspectRatio: 1, margin: '1.5%' }} />
        )}
        style={{ marginVertical: 12 }}
      />
      <Button title={uploading ? 'Uploading...' : 'Upload & Continue'} onPress={upload} />
    </View>
  );
}


