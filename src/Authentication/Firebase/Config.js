import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDej6DToNT-w0MqE2Uo89QtjzrWNBlVaLY",
  authDomain: "daily-cadence.firebaseapp.com",
  projectId: "daily-cadence",
  storageBucket: "daily-cadence.appspot.com",
  messagingSenderId: "260348097970",
  appId: "1:260348097970:web:f98733e4e3ee1a6271a0ab"
};

const app = initializeApp(firebaseConfig);
export default app;