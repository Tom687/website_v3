import config from 'config';
import db from '../../config/postgres.js';
import axios from 'axios';
import qs from 'qs';
import log from './logger.js';
import { signJwt, verifyJwt } from './jwt.js';

import lodash from 'lodash';

const { get } = lodash;

// TODO : Utiliser champ ID de sessions ou session_id ?
export const getSession = async (sessionId) => {
	// TODO : Fetch session depuis DB
	console.log('getSessionHandler - sessId', sessionId);
	const session = await db('sessions').select('*').where({ id: sessionId });
	
	//console.log('getSession - session.id', session.id);
	
	return session && session.valid === 'true' ? session : null;
};

export const invalidateSession = async (sessionId) => {
	console.log('invalidateSession - sessId', sessionId);
	const session = await db('sessions').select('*').where({ id: sessionId });
	
	if (session) {
		// TODO : MAJ DB pour dire que session est valid ?
		await db('sessions').update({ valid: false }).where({ id: sessionId });
	}
	
	return session;
};

export const createSession = async (userId, email, name, role, userAgent) => {
	const payload = { id_user: userId, /*email, */valid: true, /*name, */iat: new Date(Date.now()).toISOString(), user_agent: userAgent };
	
	// TODO : Voir si on peut faire mieux ?
	const [session] = await db('sessions').insert(payload)
		.returning(['id', 'id_user AS userId', 'valid', 'iat', 'user_agent AS userAgent']);
	
	return session;
};

export const reIssueAccessToken = async ({ refreshToken }) => {
	const { decoded } = verifyJwt(refreshToken);
	
	if (!decoded || !get(decoded, 'session')) return false;
	
	const [session] = await db('sessions').select('*')
		.where({ id: get(decoded, 'session')})
	
	if (!session || !session.valid) return false;
	
	const [user] = await db('users').select('*')
		.where({ id: session.id_user });
	
	if (!user) return false;
	
	const accessToken = signJwt(
		{ ...user, session: session.id },
		{ expiresIn: config.get('accessTokenTtl') }
	);
	
	return accessToken;
};


export const getUser = async (email) => {
	try {
		console.log('getUser - email', email);
		const [user] = await db('users').select('*').where({ email });
		
		return user;
	}
	catch (e) {
		console.log('ERR', e);
	}
};

export const getGoogleOAuthTokens = async ({ code }) => {
	const url = config.get('googleOAuthTokensUrl');
	
	const values = {
		code,
		client_id: config.get('googleClientId'),
		client_secret: config.get('googleClientSecret'),
		redirect_uri: config.get('googleOAuthRedirectUrl'),
		grant_type: 'authorization_code', // TODO : ??
	};
	
	try {
		// TODO : Voir fonctionnement de qs ? Renvoi simplement le qs de la requete ? Pourquoi stringify(val) ?
		const res = await axios.post(url, qs.stringify(values), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});
		
		return res.data;
	}
	catch (err) {
		log.error(err, 'Failed to fetch Google Oauth tokens');
		throw new Error(err.message);
	}
}

export const getGoogleUser = async ({ id_token, access_token }) => {
	try {
		const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${ access_token }`, {
			headers: {
				Authorization: `Bearer ${ id_token }`,
			},
		});
		
		return res.data;
	}
	// TODO : Gestion erreur ? catchAsync + AppError ?
	catch (err) {
		log.error(err, 'Error fetching Google User');
		throw new Error(err.message);
	}
};