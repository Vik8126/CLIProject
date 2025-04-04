import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const HomePage = () => {
  const [users, setUsers] = useState([]);
  console.log("users", users);
  
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const usersSnapshot = await firestore().collection('Users').get();
      const allUsers = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!users.length) {
    return (
      <View style={styles.center}>
        <Text>No data found!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>All Users</Text>
      {users.map(user => (
        <View key={user.id} style={styles.userContainer}>
          <Text style={styles.itemText}>ID: {user.id}</Text>
          <Text style={styles.itemText}>Name: {user.Workout || 'N/A'}</Text>
          <Text style={styles.itemText}>Email: {user.Workout || 'N/A'}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default HomePage;
