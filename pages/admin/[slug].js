import AuthCheck from '@components/AuthCheck';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';
import { auth, firestore, serverTimestamp } from '@lib/firebase/firebaseConfig';
import styles from '@styles/Admin.module.css';
import { UserContext } from '@lib/utilities/context';

export default function AdminPostEdit() {
	return (
		<AuthCheck>
			<PostManager />
		</AuthCheck>
	);
}

function PostManager() {
	const [preview, setPreview] = useState(false);

	const router = useRouter();
	const { slug } = router.query;
	console.log(slug);

	const postRef = firestore
		.collection('users')
		.doc(auth.currentUser.uid)
		.collection('posts')
		.doc(slug);
	const [post] = useDocumentData(postRef);

	return (
		<main className={styles.container}>
			{post && (
				<>
					<section>
						<h1>{post.title}</h1>
						<p>ID: {post.slug}</p>

						<PostForm
							postRef={postRef}
							defaultValues={post}
							preview={preview}
						/>
					</section>

					<aside>
						<h3>Tools</h3>
						<button onClick={() => setPreview(!preview)}>
							{preview ? 'Edit' : 'Preview'}
						</button>
						<Link href={`/${post.username}/${post.slug}`}>
							<button className="btn-blue">Live view</button>
						</Link>
					</aside>
				</>
			)}
		</main>
	);
}

const PostForm = ({ defaultValues, postRef, preview }) => {
	const [content, setContent] = useState(defaultValues.content);
	const [published, setPublished] = useState(defaultValues.published);
	const router = useRouter();
	const { slug } = router.query;
	const { username } = useContext(UserContext);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (content.length < 5) {
			toast.error('Content must be at least 5 characters long');
			return;
		} else {
			await postRef.update({
				content,
				published,
				updatedAt: serverTimestamp(),
			});
			toast.success('Post updated successfully!');
		}

		router.push(`/${username}/${slug}`);
	};

	return (
		<form onSubmit={handleSubmit}>
			{preview && (
				<div className="card">
					<ReactMarkdown>{content}</ReactMarkdown>
				</div>
			)}

			<div className={preview ? styles.hidden : styles.controls}>
				<textarea
					name="content"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					required
				/>

				<fieldset>
					<input
						className={styles.checkbox}
						name="published"
						type="checkbox"
						checked={published}
						onChange={(e) => setPublished(e.target.checked)}
					/>
					<label>Published</label>
				</fieldset>

				<button type="submit" className="btn-green">
					Save Changes
				</button>
			</div>
		</form>
	);
};
