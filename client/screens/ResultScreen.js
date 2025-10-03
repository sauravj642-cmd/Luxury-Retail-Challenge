import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function ResultScreen({ route }) {
  const { productSku } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const res = await api.post('/api/generate-tryon', { userId, productSku });
        setData(res.data);
      } catch (e) {
        setData({ error: true });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [productSku]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Creating your virtual look...</Text>
      </View>
    );
  }

  if (!data || data.error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Something went wrong. Please try again.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center' }}>
      <Image source={{ uri: data.generatedImageUrl }} style={{ width: '100%', aspectRatio: 3/4, borderRadius: 12 }} />
      <View style={{ marginTop: 16, width: '100%' }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>{data.productDetails?.name}</Text>
        <Text style={{ color: '#666', marginTop: 4 }}>{data.productDetails?.brand}</Text>
        <Text style={{ marginTop: 4 }}>{data.productDetails?.price}</Text>
        <Text style={{ marginTop: 4, color: '#999' }}>{data.productDetails?.sku}</Text>
      </View>
    </ScrollView>
  );
}


