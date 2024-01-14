import { object, string } from 'zod';

// TODO : Voir si erreur password fonctionne bien des 2 sens
export const createUserSchema = object({
	body: object({
		name: string({
			required_error: 'Name is required',
		}),
		password: string({
			required_error: 'Password is required',
		}).min(3, 'Password too short. Should be at least 3 characters long'),
		confirmPassword: string({
			required_error: 'Password confirmation is required',
		}),
		email: string({
			required_error: 'Email is required',
		}).email('Not a valid email'),
	}).refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['passwordConfirmation'],
	}),
});

// TODO : Pourquoi en TS, il exporte un type ici et pas dans session.schema ?
/*
 export type CreateUserInput = Omit<
 TypeOf<typeof createUserSchema>,
 "body.passwordConfirmation"
 >;
* */