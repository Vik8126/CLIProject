import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const navigation = useNavigation();

  const handleAuthAction = async () => {
    try {
      if (isNewUser) {
        await auth().createUserWithEmailAndPassword(email, password);
        Alert.alert('Registration Successful', 'You can now log in!');
      } else {
        await auth().signInWithEmailAndPassword(email, password);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Auth Error:', error.message);
      Alert.alert(isNewUser ? 'Registration Failed' : 'Login Failed', error.message);
    }
  };

  return (


    
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {isNewUser ? 'Register' : 'Welcome to Login Page'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button
          title={isNewUser ? 'Register' : 'Login'}
          onPress={handleAuthAction}
        />
        <Button
          title={isNewUser ? 'Switch to Login' : 'Switch to Register'}
          onPress={() => setIsNewUser(!isNewUser)}
          color="gray"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
});

export default LoginPage;
