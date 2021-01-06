import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDyTKv-Yz9-_1aCBXNnFqja9bqNbnbEFSg",
  authDomain: "mypodcast-web.firebaseapp.com",
  projectId: "mypodcast-web",
  storageBucket: "mypodcast-web.appspot.com",
  messagingSenderId: "631232164762",
  appId: "1:631232164762:web:3da0141516c3f7835b0023",
  measurementId: "G-Q8ZE9JXC0F",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
