import React, { lazy } from 'react';

import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import {Container} from "../styles/generalStyles";

const FormInput = lazy(() => import('../form/formInput'));

const forgotPasswordSchema = yup.object().shape({
	email: yup.string()
		.email('Cet email n\'est pas valide')
		.required('Veuillez saisir un email'),
});

export default function ForgotPassword() {
	const { enqueueSnackbar } = useSnackbar();
	
	const { formState: { errors }, register, handleSubmit } = useForm({
		resolver: yupResolver(forgotPasswordSchema),
	});
	
	const onSubmit = async (e) => {
		try {
			const res = await axios.post(`/auth/forgotPassword`, {
				email: e.email
			});
			
			if (res.status === 200 || res.data.status === 'success') {
				// FIXME : Snackbar 'email envoyé' ?
				enqueueSnackbar(res.data.message || 'Email envoyé !');
			}
		}
			// FIXME : Affichage de l'erreur renvoyée du back ?
		catch (err) {
			if (err.response) {
				enqueueSnackbar(err.response.data.message || err.response.data[0].message);
			}
			console.error('ForgotPassword onSubmit() err :', err);
		}
	};
	
	return (
		<Container>
			<h1>Modifier votre mot de passe</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<FormInput
						label="Adresse email"
						name="email"
						type="email"
						register={register}
						errors={errors}
					/>
				</div>
				<button type="submit">Envoyer le lien pour reset mon MDP</button>
				{/*{
				message &&
				<p>{ message }</p>
			}*/}
			</form>
		</Container>
	)
}