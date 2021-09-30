import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBq6p022TbwyCLCjnPffcHEQxvIbiaFqR8",
  authDomain: "blogging-app-a6637.firebaseapp.com",
  projectId: "blogging-app-a6637",
  storageBucket: "blogging-app-a6637.appspot.com",
  messagingSenderId: "390835252788",
  appId: "1:390835252788:web:09b29602306e608b91a461"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

export { auth, db, storage }