import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

import {
  getDBConnection,
  createUserTable,
  registerUser,
  loginUser,
} from '../Database/db';

const sqlLogin = () => {
  const [db, setDb] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    async function init() {
      const dbConn = await getDBConnection();
      await createUserTable(dbConn);
      setDb(dbConn);
    }
    init();
  }, []);

  const handleAuthAction = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Email and password are required.');
      return;
    }

    try {
      if (isNewUser) {
        await registerUser(db, email, password);
        Alert.alert('Success', 'User registered successfully!');
        setIsNewUser(false);
        setEmail('');
        setPassword('');
      } else {
        const user = await loginUser(db, email, password);
        if (user) {
          navigation.navigate('Curd'); // Navigate on successful login
        } else {
          Alert.alert('Login Failed', 'Invalid email or password');
        }
      }
    } catch (error) {
      console.error('Auth Error:', error);
      Alert.alert('Error', 'Something went wrong: ' + error.message);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.title}>{isNewUser ? 'Register' : 'Login'}</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color="#555" />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={isNewUser ? 'Register' : 'Login'}
            onPress={handleAuthAction}
          />
          <Button
            title={isNewUser ? 'Switch to Login' : 'Switch to Register'}
            onPress={() => {
              setIsNewUser(!isNewUser);
              setPassword('');
            }}
            color="gray"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#ccc', marginBottom: 15, paddingHorizontal: 10, backgroundColor: '#fff', borderRadius: 5 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 15, paddingHorizontal: 10, backgroundColor: '#fff' },
  passwordInput: { flex: 1 },
  buttonContainer: { gap: 12, marginTop: 10, width: '100%' },
});

export default sqlLogin;
