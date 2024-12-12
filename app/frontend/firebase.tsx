import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';  // Cần sử dụng cho Realtime Database
import { getFirestore } from 'firebase/firestore';  // Cần sử dụng cho Firestore
import { getAuth } from 'firebase/auth';
// const firebaseConfig = {
//     apiKey: 'AIzaSyBxmUBBlKP6ilpmOvcpr1Nn_7eI1VUdWpA',
//     authDomain: 'react-native-auth-ecd.firebaseapp.com',
//     projectId: 'hydro-care-e0e70',
//     storageBucket: 'hydro-care-e0e70.firebasestorage.app',
//     messagingSenderId: '377348076634',
//     appId: '1:867850272896:android:18043ae359cff462b5a665',
// };
const firebaseConfig = {
    apiKey: "AIzaSyA1kkHekB9dl3KD3eYkfdoV8kkCxdRprwM",
    authDomain: "hydro-care-e0e70.firebaseapp.com",
    projectId: "hydro-care-e0e70",
    storageBucket: "hydro-care-e0e70.firebasestorage.app",
    messagingSenderId: "867850272896",
    appId: "1:867850272896:web:c4411544ea96c5e7b5a665"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get database instance for Realtime Database
export const database = getDatabase(app);

// Get Firestore instance (nếu bạn dùng Firestore)
export const firestore = getFirestore(app);

// Get Auth instance
export const auth = getAuth(app);
