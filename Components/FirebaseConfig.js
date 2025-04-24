import messaging from '@react-native-firebase/messaging';
import {Alert, Platform} from 'react-native';
import notifee, {AndroidImportance} from '@notifee/react-native'; 
import firestore from '@react-native-firebase/firestore';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  }
}

export async function getFcmToken() {
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
  // 👉 Send this token to your backend
}

export function setupNotificationListeners() {
  // Foreground
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground Message:', remoteMessage);
    displayNotification(remoteMessage);
  });

  // Background
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background Message:', remoteMessage);
  });

  // When app opened from background by tapping
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background:',
      remoteMessage,
    );
  });

  // When app opened from quit state
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage,
        );
      }
    });
}

async function displayNotification(remoteMessage) {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title: remoteMessage.notification?.title || 'New Notification',
    body: remoteMessage.notification?.body || '',
    android: {
      channelId,
      smallIcon: 'ic_launcher', // optional, use app icon or custom
    },
  });
}


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
  } catch (error) {
    console.error('Error saving payment:', error);
    throw error;
  }
};