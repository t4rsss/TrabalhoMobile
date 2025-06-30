import React, { useState } from 'react';
import { View, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { loginUser } from '../controllers/authController';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      navigation.replace('Game');
    } catch (error) {
      alert("Erro no login: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <TouchableOpacity onPress={handleLogin}>
        <Image source={require('../assets/btnlogin.gif')} style={{ width: 200, height: 60 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Image source={require('../assets/btnsignup.gif')} style={{ width: 200, height: 60, marginTop: 10 }} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  input: { backgroundColor: '#fff', width: '80%', padding: 10, marginVertical: 8, borderRadius: 5 }
});