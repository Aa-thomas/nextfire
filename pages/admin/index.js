import AuthCheck from '@components/AuthCheck';
import PostFeed from '@components/PostFeed';
import { auth, firestore } from '@lib/firebase/firebaseConfig';
import { UserContext } from '@lib/utilities/context';
import kebabCase from 'lodash.kebabcase';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import toast from 'react-hot-toast';
import styles from '@styles/Input.module.css';
import { serverTimestamp } from 'firebase/firestore';

export default function AdminPostsPage({}) {
	return (
		<main>
			<AuthCheck>
				<PostList />
				<CreateNewPost />
			</AuthCheck>
		</main>
	);
}

const PostList = () => {
	const ref = firestore
		.collection('users')
		.doc(auth.currentUser.uid)
		.collection('posts');

	const query = ref.orderBy('createdAt');
	const [querySnapshot] = useCollection(query);

	const posts = querySnapshot?.docs.map((doc) => doc.data());

	console.log(posts);

	return (
		<>
			<h1>Manage Your Posts</h1>
			<PostFeed posts={posts} admin />
		</>
	);
};

const CreateNewPost = () => {
	const router = useRouter();
	const { username } = useContext(UserContext);
	const [title, setTitle] = useState('');

	// Ensure slug is URL safe
	const slug = encodeURI(kebabCase(title));
	const isValid = title.length > 3 && title.length < 100;

	const createPost = async (e) => {
		e.preventDefault();
		const uid = auth.currentUser.uid;
		const ref = firestore
			.collection('users')
			.doc(uid)
			.collection('posts')
			.doc(slug);

		// Tip: give all fields a default value here
		const data = {
			title,
			slug,
			uid,
			username,
			published: false,
			content: '# hello world!',
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
			heartCount: 0,
		};

		await ref.set(data);

		toast.success('Post created!');

		// Imperative navigation after doc is set
		router.push(`/admin/${slug}`);
	};
	return (
		<form onSubmit={createPost}>
			<input
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="My Awesome Article!"
				className={styles.input}
			/>
			<p>
				<strong>Slug:</strong> {slug}
			</p>
			<button type="submit" disabled={!isValid} className="btn-green">
				Create New Post
			</button>
		</form>
	);
};
