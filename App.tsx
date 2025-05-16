import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './Components/LoginPage';
import HomePage from './Components/HomePage';
import PaymentScreen from './Components/PaymentScreen';
import { requestUserPermission, setupNotificationListeners } from './Components/FirebaseConfig';
import curdOpr from './Components/curdOpr';
import sqlLogin from './Components/sqlLogin';

const CliStack = createStackNavigator();

const App = () => {

  useEffect(() => {
    requestUserPermission();
    setupNotificationListeners();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <CliStack.Navigator initialRouteName='Sql'>
          <CliStack.Screen name='Login' component={LoginPage} />
          <CliStack.Screen name='Home' component={HomePage} />
          <CliStack.Screen name='Payment' component={PaymentScreen} />
          <CliStack.Screen name='Curd' component={curdOpr} />
          <CliStack.Screen name='Sql' component={sqlLogin} />
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
