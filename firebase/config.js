import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA96sGkkTI3yPXQBOzAdvSM141D-K431NE",
  authDomain: "ttr-project-974ca.firebaseapp.com",
  projectId: "ttr-project-974ca",
  storageBucket: "ttr-project-974ca.appspot.com",
  messagingSenderId: "212123950176",
  appId: "1:212123950176:web:e3cc836c6408b58f1c7705",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const projectStorage = firebase.storage();
const projectFirestore = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { firebase, projectStorage, projectFirestore, timestamp };
