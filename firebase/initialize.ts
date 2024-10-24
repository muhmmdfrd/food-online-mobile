import { initializeApp } from "@react-native-firebase/app";
import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_BUCKET,
  FIREBASE_PROJECT_ID,
} from "@env";

const app = initializeApp({
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID ?? "",
  storageBucket: FIREBASE_PROJECT_BUCKET ?? "",
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID ?? "",
  measurementId: FIREBASE_MEASUREMENT_ID,
  databaseURL: "",
});

export { app };
