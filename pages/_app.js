import Navbar from '@components/NavBar';
import { Toaster } from 'react-hot-toast';
import '@styles/globals.css';
import { UserContext } from '@utilities/context';
import { useUserData } from '@hooks/useUserData';

function MyApp({ Component, pageProps }) {
	const userData = useUserData();
	return (
		<>
			<UserContext.Provider value={userData}>
				<Navbar />
				<Component {...pageProps} />
				<Toaster />
			</UserContext.Provider>
		</>
	);
}

export default MyApp;
