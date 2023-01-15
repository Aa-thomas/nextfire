import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import moment from 'moment';

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

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
	const usersRef = firestore.collection('users');
	const query = usersRef.where('username', '==', username).limit(1);
	const userDoc = (await query.get()).docs[0];
	return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
	const data = doc.data();
	return {
		...data,
		// Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
		createdAt: data.createdAt.seconds,
		updatedAt: data.updatedAt.seconds,
	};
}
