// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0PY1N86HykJ7nqBi1HTk7mHipOAAsUgY",
  authDomain:"komparcrm.firebaseapp.com",
  projectId: "komparcrm",
  storageBucket:"komparcrm.appspot.com",
  messagingSenderId:"558093639007",
  appId: "1:558093639007:web:e2ad823aa34cdfdfb66aea",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
