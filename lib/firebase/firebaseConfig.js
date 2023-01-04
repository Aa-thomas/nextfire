import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyDXks5iV7Svr0nJ4tVdnnaUq7yrFibROGk',
	authDomain: 'nextfire-bd43e.firebaseapp.com',
	projectId: 'nextfire-bd43e',
	storageBucket: 'nextfire-bd43e.appspot.com',
	messagingSenderId: '345123017191',
	appId: '1:345123017191:web:a893b9911ed15ae5d2ad42',
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
