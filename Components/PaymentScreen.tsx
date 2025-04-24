import React from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import firestore from '@react-native-firebase/firestore';

export const savePaymentDetails = async (
  paymentId: string,
  amount: number,
  status: string,
) => {
  try {
    await firestore().collection('payments').add({
      paymentId,
      amount,
      status,
      timestamp: firestore.FieldValue.serverTimestamp(),
    });
    console.log('Payment details saved successfully!');
  } catch (error) {
    console.error('Error saving payment:', error);
    throw error;
  }
};

const PaymentScreen = () => {
  const initiatePayment = async () => {
    const options = {
      description: 'Test Payment',
      image: 'https://virtualrealdesign.com/new_assets/Updated_2025/VDOC%20Logo.webp',
      currency: 'INR',
      key: 'rzp_test_ccWb5Kmug3d2T9',
      amount: 10000,
      name: 'Your Company Name',
      prefill: {
        email: 'test@example.com',
        contact: '9999999999',
        name: 'Test User',
      },
      theme: { color: '#FF5722' },
    };

    try {
      const data = await RazorpayCheckout.open(options);

      await savePaymentDetails(data.razorpay_payment_id, 100, 'success');

      Alert.alert(
        'Success',
        `Payment ID: ${data.razorpay_payment_id}`,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      );
    } catch (error: any) {
      await savePaymentDetails('failed_payment', 100, 'failed');

      Alert.alert(
        'Error',
        error?.description || 'Payment failed',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.payButton} onPress={initiatePayment}>
        <Text style={styles.payButtonText}>Pay ₹100</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
