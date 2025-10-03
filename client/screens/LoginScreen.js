import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      await AsyncStorage.setItem('token', res.data.token);
      await AsyncStorage.setItem('userId', res.data.user.id);
      await AsyncStorage.setItem('hasPhotos', (res.data.user.photoUrls?.length > 0).toString());
      if (res.data.user.photoUrls?.length > 0) {
        navigation.replace('MainApp');
      } else {
        navigation.replace('Onboarding');
      }
    } catch (e) {
      Alert.alert('Login failed', 'Check your credentials and try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, gap: 12, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 16 }}>Welcome back</Text>
      <TextInput placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 12, borderRadius: 8 }} />
      <Button title={loading ? 'Signing in...' : 'Login'} onPress={onLogin} />
      <Button title="No account? Sign Up" onPress={() => navigation.navigate('SignUp')} />
    </View>
  );
}


