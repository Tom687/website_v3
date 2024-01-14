import { createContext, useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';

export const AuthContext = createContext(null);

/*export const AuthContext = createContext({
	auth: {
		isLoggedIn: {},
	}
});*/

export default function AuthContextProvider({ children }) {
	const initialState = {
		isLoggedIn: false,
		isLoginPending: false,
		loginError: null,
		//user: {},
	};
	const [state, setState] = useState(initialState);
	const [user, setUser] = useState({});
	const [loading, setLoading] = useState(true);
	
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	
	// FIXME : Si user a une session qui n'a pas été désactivée (logout sans appuyer sur BTN), bug car fetchToken retourne n'importe quelle session de l'user. Matcher avec user-agent ?
	useEffect(() => {
		let isSubscribed = true;
		setState(prevState => ({
			...prevState,
			isLoginPending: true,
		}));
		
		const fetchToken = async () => {
			try {
				setState(prevState => ({
					...prevState,
					isLoginPending: true,
				}));
				
				const res = await axios.get('/me/sessions', {
					withCredentials: true
				});
				
				if (isSubscribed && (res.status === 200 || res.data.status === 'success')) {
					setState(prevState => ({
						...prevState,
						isLoginPending: false,
						isLoggedIn: true,
						//user: res.data.user,
					}));
					setUser(res.data.user);
					setLoading(false);
				}
			}
			catch (e) {
				console.log('fetchToken error :', e);
				setState(prevState => ({
					...prevState,
					isLoginPending: false,
					isLoggedIn: false,
				}));
				setLoading(false);
			}
		}

		fetchToken();
		
		return () => isSubscribed = false;
	}, []);
	
	const login = async ({ email, password, rememberMe }) => {
		setState(prevState => ({
			...prevState,
			isLoginPending: true,
		}));
		
		try {
			const res = await axios.post('/sessions', {
				email, password, rememberMe
			}, {
				withCredentials: true,
			});
			
			if (res.status === 200 || res.data.status === 'success') {
				setState(prevState => ({
					...prevState,
					isLoginPending: false,
					isLoggedIn: true,
					//user: res.data.user,
				}));
				
				enqueueSnackbar(res.data.message);
				setUser(res.data.user);
				return true;
			}
		}
		catch (e) {
			setState(prevState => ({
				...prevState,
				isLoginPending: false,
				isLoggedIn: false,
				loginError: 'Erreur login AuthContext',
			}));
			if (e.response) {
				enqueueSnackbar(e.response.data.message);
			}
		}
	}
	
	const logout = async () => {
		try {
			const res = await axios.delete('/sessions', {
				withCredentials: true
			});
			
			if (res.status === 200) {
				console.log({...res.data})
				setState({
					isLoggedIn: false,
					isLoginPending: false,
					loginError: null,
					//user: {},
				});
				setUser({});
			}
		}
		catch (e) {
			console.log('logout error', e);
			if (e.response) {
				enqueueSnackbar(e.response.data.message);
			}
		}
	}
	
	return (
		<AuthContext.Provider
			value={{
				state,
				isLoggedIn: state.isLoggedIn,
				isLoginPending: state.isLoginPending,
				loginError: state.loginError,
				user,
				setUser,
				login,
				logout
			}}
		>
			{ !loading && children }
		</AuthContext.Provider>
	)
}