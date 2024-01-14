import db from '../../config/postgres.js';
import catchAsync from '../middlewares/catchAsync.js';
import AppError from '../utils/AppError.js';

import * as crypto from 'crypto';
import moment from 'moment';
import Email from '../utils/email.js';
import bcrypt from 'bcrypt';
import config from 'config';

export const forgotPassword = catchAsync(async (req, res, next) => {
	const { email } = req.body;
	
	if (!email) {
		return next(new AppError('Adresse email invalide', 400));
	}
	
	const [user] = await db('users').select('id', 'name', 'email')
		.where({ email });
	
	if (!user) {
		return next(new AppError('Utilisateur inexistant', 404));
	}
	
	const resetToken = crypto.randomBytes(32).toString('hex');
	const hashedResetToken = crypto.createHash('sha256')
		.update(resetToken)
		.digest('hex');
	// TODO : Voir si utiliser heure serveur est une bonne idée ?
	const resetTokenExpiration = moment().add(30, 'm');
	
	const updatedUser = await db('login')
		.update({
			reset_token: hashedResetToken,
			reset_token_expiration: resetTokenExpiration,
		})
		.where({ email });
	
	if (!updatedUser) {
		return next(new AppError('Adresse email non trouvée 2222', 404));
	}
	
	// TODO : Voir si route est bonne (/api/auth ?)
	// PROD :
	//    const resetUrl = `${req.hostname}/resetPassword/${resetToken}`;
	const resetUrl = `${req.get('origin')}/resetPassword/${resetToken}`;
	//const resetUrl = `${config.get('apiUrl')}/api/auth/resetPassword/${resetToken}`;
	
	// TODO : Double try / catch ? Comment mieux gérer ça ?
	// TODO : Expiration du token en UTC ou locale ?
	try {
		await new Email(user, resetUrl).sendPasswordReset();
		
		res.status(200).json({
			status: 'success',
			message: 'Un email contenant un lien pour modifier votre MDP vous a été envoyé',
		});
	}
	catch (err) {
		await db('login')
			.where({ email })
			.update({ reset_token: null, reset_token_expiration: null });
		
		return next(new AppError('Email non envoyé. Veuillez réessayer', 500));
	}
});

// TODO : Logout l'user sur les autres sessions si il change de MDP (renouveler le JWT ?)
// TODO : Renvoyer les erreurs au front (token expiré,…)
export const resetPassword = catchAsync(async (req, res, next) => {
	const { password, confirmPassword } = req.body;
	
	// Get user from token
	const hashedToken = crypto.createHash('sha256')
		.update(req.params.token)
		.digest('hex');
	
	const [user] = await db('login').select('id', 'email', 'reset_token', 'reset_token_expiration')
		.where({ reset_token: hashedToken });
	
	if (!user) {
		return next(new AppError('Utilisateur ou reset token inexistant', 404));
	}
	// TODO Voir si moment() change selon serveur ? Dans ce cas, forcer la date en UTC
	if (user.reset_token_expiration <= moment()) {
		return next(new AppError('Le reset token a expiré', 400));
	}
	if (password !== confirmPassword) {
		return next(new AppError('Les mots de passe ne correspondent pas', 400));
	}
	
	const hash = await bcrypt.hash(password, config.get('saltWorkFactor'));
	
	// TODO : Double try / catch ?
	try {
		await db('login')
			.update({ hash, reset_token: null, reset_token_expiration: null });
		
		// TODO : Supprimer toutes les sessions de l'user après modif du MDP ou juste valid: false ?
		await db('sessions').update({ valid: false })
			.where({ id_user: user.id })
		
		return res.status(200).json({
			status: 'success',
			message: 'Le mot de passe a été modifié avec succès. Vous allez être redirigé',
			accessToken: null,
			refreshToken: null,
		});
	}
	catch (err) {
		return res.status(400).json({
			status: 'error',
			message: 'Erreur lors de la réinisialisation du mot de passe. Merci de réessayer',
		});
	}
});