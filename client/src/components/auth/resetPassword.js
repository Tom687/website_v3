import React, { useContext, useState, lazy } from 'react'

import axios from 'axios'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useHistory, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { AuthContext } from '../../contexts/auth'
import { Container } from '../styles/generalStyles'

const FormInput = lazy(() => import('../form/formInput'))

const resetPasswordSchema = yup.object().shape({
  password: yup.string()
    .required('Veuillez choisir un mot de passe')
    .min(1, 'Votre mot de passe est trop court'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null],
      'Les mots de passe ne correspondent pas')
    .required('Veuillez confirmer votre mot de passe')
    .min(1, 'Votre mot de passe est trop court'),
})


export default function ResetPassword() {
  const { enqueueSnackbar } = useSnackbar()
  const { token } = useParams()
  const { logout } = useContext(AuthContext)
  let navigate = useNavigate()
  let location = useLocation()

  const { formState: { errors }, register, handleSubmit } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  })

  // TODO : Erreur "le token a expiré"
  const onSubmit = async (e) => {
    console.log({ token })
    let from = location.state?.from?.pathname || '/'

    try {
      const res = await axios.patch(`/auth/resetPassword/${token}`, {
        password: e.password,
        confirmPassword: e.confirmPassword,
      })

      if (res.status === 200 || res.data.status === 'success') {
        enqueueSnackbar(res.data.message)
        // TODO : Tester history et navigate ?
        setTimeout(() => {
          /*history.push('/signin');*/
          logout()
          navigate('/', { replace: true })
        }, 2000)
      }
    }
    catch (err) {
      if (err.response) {
        enqueueSnackbar(err.response.data.message || err.response.data[0].message)
      }
      console.log('ResetPassword onSubmit() err :', err)
    }
  }

  return (
    <Container>
      <h1>Modifier votre mot de passe</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <FormInput
            label="Nouveau mot de passe"
            name="password"
            type="password"
            register={register}
            errors={errors}
          />
        </div>
        <div>
          <FormInput
            label="Confirmer mot de passe"
            name="confirmPassword"
            type="password"
            register={register}
            errors={errors}
          />
        </div>
        <button type="submit">Envoyer mon nouveau mot de passe</button>
        {/*{
				message &&
				<p>{ message }</p>
			}*/}
      </form>
    </Container>

  )
}