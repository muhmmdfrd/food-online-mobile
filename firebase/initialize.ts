import { firebase } from "@react-native-firebase/messaging";

export default function Initialize() {
  firebase.app().messaging().requestPermission();
}
