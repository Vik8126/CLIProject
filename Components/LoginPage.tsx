import React, {useState} from 'react';
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
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showForget, setShowForget] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigation = useNavigation();

  const handleAuthAction = async () => {
    try {
      if (isNewUser) {
        await auth().createUserWithEmailAndPassword(email, password);
        Alert.alert('Registration Successful', 'You can now log in!');
        setIsNewUser(false);
      } else {
        await auth().signInWithEmailAndPassword(email, password);
        navigation.navigate('Curd');
      }
    } catch (error) {
      console.error('Auth Error:', error.message);
      Alert.alert(
        isNewUser ? 'Registration Failed' : 'Login Failed',
        error.message,
      );
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert(
        'Password Reset Email Sent',
        'Please check your email inbox for instructions to reset your password.',
      );
      setResetEmailSent(true);
      setShowForget(false);
    } catch (error) {
      console.error('Password Reset Error:', error);
      let errorMessage = 'Failed to send reset email. Please try again.';

      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address is invalid.';
      }

      Alert.alert('Error', errorMessage);
    }
  };

  const toggleForgetMode = () => {
    setShowForget(!showForget);
    setResetEmailSent(false);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {showForget
            ? 'Reset Your Password'
            : isNewUser
            ? 'Register'
            : 'Login'}
        </Text>

        {resetEmailSent ? (
          <View style={styles.resetSuccess}>
            <Text style={styles.resetText}>
              Password reset email sent to {email}
            </Text>
            <Button
              title="Back to Login"
              onPress={() => {
                setShowForget(false);
                setResetEmailSent(false);
              }}
            />
          </View>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {!showForget && (
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}>
                  <Icon
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <Button
                title={
                  showForget
                    ? 'Send Reset Email'
                    : isNewUser
                    ? 'Register'
                    : 'Login'
                }
                onPress={showForget ? handlePasswordReset : handleAuthAction}
              />

              {!showForget && (
                <Button
                  title={isNewUser ? 'Switch to Login' : 'Switch to Register'}
                  onPress={() => {
                    setIsNewUser(!isNewUser);
                    setPassword('');
                  }}
                  color="gray"
                />
              )}

              <Pressable onPress={toggleForgetMode}>
                <Text style={styles.forgetStyle}>
                  {showForget ? '← Back to Login' : 'Forgot Password?'}
                </Text>
              </Pressable>
            </View>
          </>
        )}
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
  passwordContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  forgetStyle: {
    marginTop: 10,
    textDecorationLine: 'underline',
    color: '#007BFF',
  },
  resetSuccess: {
    alignItems: 'center',
    padding: 20,
  },
  resetText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LoginPage;
