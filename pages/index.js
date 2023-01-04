import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Loader from '@components/Loader';
import toast from 'react-hot-toast';

export default function Home() {
	return (
		<>
			<Link
				prefetch={false}
				href={{
					pathname: '/[username]',
					query: { username: 'aaron221' },
				}}
				// href='/aaron21'
			>
				Aarons Profile
			</Link>
			<Loader show />
			<button onClick={() => toast.success('Look! A message!')}>
				{' '}
				Try me Hehe
			</button>
		</>
	);
}
