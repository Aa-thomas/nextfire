import { auth, googleAuthProvider, firestore } from '@firebase/firebaseConfig';
import { UserContext } from '@utilities/context';
import { useEffect, useState, useCallback } from 'react';
import { useContext } from 'react';
import debounce from 'lodash.debounce';

export default function EnterPage({}) {
	const { user, username } = useContext(UserContext);

	return (
		<main>
			{/* // 1. if user signed out <SignInButton />
			// 2. if user signed in, but no username <UsernameForm />
			// 3. if user signed in, has username <SignOutButton /> */}
			{user ? (
				!username ? (
					<UserNameForm />
				) : (
					<SignOutButton />
				)
			) : (
				<SignInButton />
			)}
		</main>
	);
}

// Sign In Button
function SignInButton() {
	const signInWithGoogle = async () => {
		await auth.signInWithPopup(googleAuthProvider);
	};

	return (
		<>
			<button className="btn-google" onClick={signInWithGoogle}>
				<img src={'/googlelogo.png'} /> Sign In With Google
			</button>
		</>
	);
}

// Sign Out Button
function SignOutButton() {
	return <button onClick={() => auth.signOut()}> Sign Out </button>;
}

// Message to display when checking usernames
function UsernameMessage({ username, isValid, loading }) {
	if (loading) {
		return <p>Checking...</p>;
	} else if (isValid) {
		return <p className="text-success">{username} is available!</p>;
	} else if (username && !isValid) {
		return <p className="text-danger">That username is taken!</p>;
	} else {
		return <p></p>;
	}
}

//
function UserNameForm() {
	const [formValue, setFormValue] = useState('');
	const [isValid, setIsValid] = useState(false);
	const [loading, setLoading] = useState(false);

	const { user, username } = useContext(UserContext);

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Create refs for both documents
		const userDoc = firestore.doc(`users/${user.uid}`);
		const usernameDoc = firestore.doc(`usernames/${formValue}`);

		// Commit both docs together as a batch write.
		const batch = firestore.batch();
		batch.set(userDoc, {
			username: formValue,
			photoURL: user.photoURL,
			displayName: user.displayName,
		});
		batch.set(usernameDoc, { uid: user.uid });

		await batch.commit();
	};

	const handleChange = (e) => {
		// Force form value typed into form to match correct format
		const val = e.target.value.toLowerCase();
		const regex = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

		// Only set form value if length is greater than 3 OR it passes regex
		if (val.length < 3) {
			setFormValue(val);
			setLoading(false);
			setIsValid(false);
		}

		if (regex.test(val)) {
			setFormValue(val);
			setLoading(true);
			setIsValid(false);
		}
	};

	// Check username everytime formValue changes
	useEffect(() => {
		checkUsername(formValue);
	}, [formValue]);

	// Hit the database for username match after each debounced change
	// useCallback is required for debounce to work
	// npm install lodash.debounce for debounce to work
	const checkUsername = useCallback(
		debounce(async (username) => {
			if (username.length >= 3) {
				const ref = firestore.doc(`usernames/${username}`);
				const { exists } = await ref.get();
				console.log('Firestore read executed!');
				setIsValid(!exists);
				setLoading(false);
			}
		}, 500),
		[]
	);

	return (
		!username && (
			<section>
				<h3>Choose Username</h3>
				<form onSubmit={handleSubmit}>
					<input
						name="username"
						placeholder="myname"
						value={formValue}
						onChange={handleChange}
					/>
					<UsernameMessage
						username={formValue}
						isValid={isValid}
						loading={loading}
					/>
					<button type="submit" className="btn-green" disabled={!isValid}>
						Choose
					</button>

					<h3>Debug State</h3>
					<div>
						Username: {formValue}
						<br />
						Loading: {loading.toString()}
						<br />
						Username Valid: {isValid.toString()}
					</div>
				</form>
			</section>
		)
	);
}
