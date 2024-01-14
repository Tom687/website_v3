import AppError from '../utils/AppError.js';
import catchAsync from '../middlewares/catchAsync.js';
import db from '../../config/postgres.js';
import config from 'config';
import lodash from 'lodash';
import { signJwt } from '../utils/jwt.js';
import { createSession, getGoogleOAuthTokens, getGoogleUser } from '../utils/sessions.js';
import bcrypt from 'bcrypt';


const { get } = lodash;

const accessTokenCookieOptions = {
	maxAge: 9000000 * 2, // 300min
	httpOnly: true,
	domain: config.get('domain'), // TODO : Ajouter au fichier config car on aura besoin de changer en production
	path: '/',
	// sameSite: 'lax' permet d'envoyer le cookie  dans request header directement et éviter un flash de la page login
	sameSite: 'lax',
	secure: config.get('cookieTokenSecure'),
};

const refreshTokenCookieOptions = {
	...accessTokenCookieOptions,
	maxAge: 3.154e10, // 1 year
};

// Get user
// Create session
// Create access & refresh token
// Set cookies with tokens
// Send back tokens

const validateUserLogin = async ({ email, password }) => {
	if (!email || !password) {
		return false;
		//return next(new AppError('Formulaire incomplet', 400));
	}
	
	const [loginInfo] = await db('login').select('email', 'hash', 'role')
		.where({ email });
	
	if (!loginInfo) {
		return 'Adresse email non reconnue';
	}
	
	const isPasswordValid = await bcrypt.compare(password, loginInfo.hash);
	
	if (!isPasswordValid) {
		return 'Mauvais MDP';
		//return next(new AppError('Mauvais identifiants 2', 400));
	}
	
	const [user] = await db('users').select('id', 'name', 'email', 'joined')
		.where({ email });
	
	if (!user) {
		return 'Utilisateur inexistant';
		//return next(new AppError('Utilisateur inconnu', 400));
	}
	
	user.role = loginInfo.role;
	
	return user;
	//res.status(200).json({
	//	status: 'success',
	//	message: 'Connexion réalisée avec succès',
	//	user
	//});
};

export const createUserSessionHandler = catchAsync(async (req, res, next) => {
	const { email, password, rememberMe } = req.body;

	const user = await validateUserLogin({ email, password });

	// TODO : Si email reconnu mais mauvais MDP, cette erreur sort
	if (typeof user === 'string') {
		return next(new AppError(user), 401);
	}
	
	const session = await createSession(user.id, user.email, user.name, user.role, req.get('user-agent') || '');
	
	const accessToken = signJwt(
		{ ...user, session: session.id },
		{ expiresIn: config.get('accessTokenTtl' )}, // 10 minutes
	);
	
	const refreshToken = signJwt(
		{ ...user, session: session.id },
		{ expiresIn: rememberMe
		             ? config.get('refreshTokenTtlRememberMe')
		             : config.get('refreshTokenTtl') }
	);
	
	res.cookie('accessToken', accessToken, accessTokenCookieOptions);
	res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);
	
	user.session = session.id;
	
	return res.status(200).json({
		status: 'success',
		message: 'Vous êtes maintenant connecté',
		accessToken,
		user
	});
});

export const getUserSessionsHandler = catchAsync(async (req, res, next) => {
	const userId = res.locals.user.id;
	
	if (!userId) {
		return next(new AppError('Vous n\'êtes pas autorisé à voir cette page', 403));
	}
	
	// TODO : Retourner aussi les valid: false ?
	//  => Permet de lister à l'user ses sessions actives
	const [sessions] = await db('sessions').select('*')
		.where({ id_user: userId, valid: true });
	
	if (!sessions) {
		return next(new AppError('getUserSessionsHandler : Session inexistante', 400));
	}
	
	const [user] = await db('users').select('id', 'name', 'email', 'picture', 'joined')
		.where({ id: userId });
	
	if (!user) {
		return next(new AppError('Utilisateur inexistant', 400));
	}
	
	user.role = res.locals.user.role;
	user.session = sessions.id;
	
	// TODO : Retourner user depuis DB users ? Pour avoir les dernières infos ?
	// TODO : Utile de supprime iat et exp ?
	//const user = { ...res.locals.user };
	//delete user.iat;
	//delete user.exp;
	
	return res.status(200).json({
		status: 'success',
		sessions,
		user
	});
});



export const getUserCurrentSessionHandler = catchAsync(async (req, res, next) => {
	const userId = res.locals.user.id;
	const sessionId = res.locals.user.session;
	
	if (!userId || !sessionId) {
		return next(new AppError('Vous n\'êtes pas autorisé à voir cette page', 403));
	}
	
	// TODO : Utiliser valid: true ? Si valid: false, utiliser reIssueAccessToken ?
	const [session] = await db('sessions').select('*')
		.where({ id: sessionId, id_user: userId/*, valid: true*/ });
	
	
	if (!session) {
		return next(new AppError('Session inexistante', 400));
	}
	
	const [user] = await db('users').select('id', 'name', 'email', 'picture', 'joined')
		.where({ id: userId });
	
	if (!user) {
		return next(new AppError('Utilisateur inexistant', 400));
	}
	
	user.role = res.locals.user.role;
	user.session = session.id;
	
	// TODO : Retourner user depuis DB users ? Pour avoir les dernières infos ?
	// TODO : Utile de supprime iat et exp ?
	//const user = { ...res.locals.user };
	//delete user.iat;
	//delete user.exp;
	
	return res.status(200).json({
		status: 'success',
		session,
		user
	});
});



export const deleteSessionHandler = catchAsync(async (req, res, next) => {
	const sessionId = res.locals.user.session;
	
	const accessTokenCookie = get(req, 'cookies.accessToken');
	const refreshTokenCookie = get(req, 'cookies.refreshToken');
	
	if (accessTokenCookie) {
		res.clearCookie('accessToken', {
			...accessTokenCookieOptions,
			maxAge: 0,
		});
	}
	if (refreshTokenCookie) {
		res.clearCookie('refreshToken', {
			...accessTokenCookieOptions,
			maxAge: 0,
		});
	}
	
	const updated = await db('sessions').update({ valid: false })
		.where({ id: sessionId });
	
	if (!updated) {
		// FIXME : Code 400 bon ici ?
		return next(new AppError('Un problème est survenu. Veuillez rafraichir la page', 400));
	}
	
	// TODO : voir status del ?
	return res.status(200).json({
		status: 'success',
		message: 'Déconnecté avec succès',
		accessToken: null,
		refreshToken: null,
	});
});

// TODO : Utiliser catchAsync + AppError ? Comment ?
export const googleOAuthHandler = catchAsync(async (req, res, next) => {
	// TODO : A quoi correspond code ?
	const code = req.query.code;
	
	// Get the id and access token with code
	const { id_token, access_token } = await getGoogleOAuthTokens({ code });
	
	// TODO : On pourrait récupérer les infos utilisateurs en décodant id_token (recommandé)
	//  => Mais on va voir une autre méthode utilis ant une requête supplémentaire avec access_token
	//const googleUser = jwt.decode(id_token);
	//console.log({ googleUser })
	
	// Get user with token
	const googleUser = await getGoogleUser({ id_token, access_token });
	
	if (!googleUser.verified_email) {
		return next(new AppError('Votre compte Google n\'est pas vérifié', 403));
	}
	
	// Upsert user
	const [user] = await db('users')
		.insert({
			email: googleUser.email,
			name: googleUser.name,
			picture: googleUser.picture
		})
		.onConflict('email')
		.merge()
		.returning('*');
	
	// Create a sessions
	const session = await createSession(user.id, user.email, user.name, user.role, req.get('user-agent') || '');
	
	// Create an access token
	const accessToken = signJwt(
		{ ...user, session: session.id },
		{ expiresIn: config.get('accessTokenTtl') }, // 15 minutes
	);
	
	// Create a refresh token
	const refreshToken = signJwt(
		{ ...user, session: session.id },
		{ expiresIn: config.get('refreshTokenTtl') }, // 1 year
	);
	
	// Set tokens in cookies
	res.cookie('accessToken', accessToken, accessTokenCookieOptions);
	
	res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);
	
	// Redirect back to client
	res.redirect(config.get('origin'));
});