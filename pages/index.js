import PostFeed from '@components/PostFeed';
import Loader from '@components/Loader';
import { firestore, fromMillis, postToJSON } from '@firebase/firebaseConfig';
import { useState } from 'react';
import Metatags from '@components/MetaTags';

// Max posts to query per page
const LIMIT = 1;

export async function getServerSideProps(context) {
	const postsQuery = firestore
		// .collectionGroup allows us to find any subcollection thats nested anywhere within
		.collectionGroup('posts')
		.where('published', '==', true)
		.orderBy('createdAt', 'desc')
		.limit(LIMIT);

	const posts = (await postsQuery.get()).docs.map(postToJSON);

	return {
		props: { posts }, // will be passed to the page component as props
	};
}

export default function Home(props) {
	const [posts, setPosts] = useState(props.posts);
	const [loading, setLoading] = useState(false);

	const [postsEnd, setPostsEnd] = useState(false);

	const getMorePosts = async () => {
		setLoading(true);
		const last = posts[posts.length - 1];

		const cursor =
			typeof last.createdAt === 'number'
				? fromMillis(last.createdAt * 1000)
				: last.createdAt;

		const query = firestore
			.collectionGroup('posts')
			.where('published', '==', true)
			.orderBy('createdAt', 'desc')
			.startAfter(cursor)
			.limit(LIMIT);

		const newPosts = (await query.get()).docs.map((doc) => doc.data());

		setPosts(posts.concat(newPosts));
		setLoading(false);

		if (newPosts.length < LIMIT) {
			setPostsEnd(true);
		}
		console.log(newPosts);
	};

	return (
		<main>
			<Metatags title={'lil nextfire app'} />
			<PostFeed posts={posts} />

			{!loading && !postsEnd && (
				<button onClick={getMorePosts}>Load more</button>
			)}

			<Loader show={loading} />

			{postsEnd && 'You have reached the end!'}
		</main>
	);
}
