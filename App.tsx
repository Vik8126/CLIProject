import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './Components/LoginPage';
import HomePage from './Components/HomePage';
import { requestUserPermission, setupNotificationListeners } from './Components/FirebaseConfig';

const CliStack = createStackNavigator();

const App = () => {

  useEffect(() => {
    requestUserPermission();
    setupNotificationListeners();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <CliStack.Navigator initialRouteName='Login'>
          <CliStack.Screen name='Login' component={LoginPage} />
          <CliStack.Screen name='Home' component={HomePage} />
        </CliStack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
