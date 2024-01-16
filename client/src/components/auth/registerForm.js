import { lazy } from 'react'
import { useSnackbar } from 'notistack'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Container } from '../styles/generalStyles'

const FormInput = lazy(() => import('../form/formInput'))

const registerSchema = yup.object().shape({
  name: yup.string()
    .required('Veuillez saisir un pseudo'),
  email: yup.string()
    .email('Cet email n\'est pas valide')
    .required('Veuillez saisir un email')
    .max(255, 'Cet email est trop long'),
  confirmEmail: yup.string()
    .email('Cet email n\'est pas valide')
    .oneOf([yup.ref('email'), null],
      'Les adresses emails ne correspondent pas')
    .required('Veuillez confirmer votre email'),
  password: yup.string()
    .required('Veuillez choisir un mot de passe')
    .min(1, 'Votre mot de passe est trop court'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null],
      'Les mots de passe ne correspondent pas')
    .required('Veuillez confirmer votre mot de passe')
    .min(1, 'Votre mot de passe est trop court'),
})

export default function RegisterForm() {
  const { enqueueSnackbar } = useSnackbar()
  let navigate = useNavigate()
  let location = useLocation()

  const initialValues = {
    values: {
      name: '',
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
    },
    errors: {},
  }

  const { formState: { errors }, register, handleSubmit } = useForm({
    resolver: yupResolver(registerSchema),
  })

  const onSubmit = async (form) => {
    try {
      let from = location.state?.from?.pathname || '/'

      const res = await axios.post('/users', form, {
        withCredentials: true,
      })

      console.log({ res })
      if (res.status === 201 || res.status === 200 || res.data.status === 'success') {
        enqueueSnackbar(res.data.message)
        navigate(from, { replace: true })
      }
    }
    catch (err) {
      if (err.response) {
        enqueueSnackbar(err.response.data.message || err.response.data[0].message)
      }
      console.log('RegisterForm onSubmit() err :', err)
    }
  }

  return (
    <Container>
      <h1>S'inscrire</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Nom d'utilisateur"
          name="name"
          register={register}
          errors={errors}
        />
        <FormInput
          label="Adresse email"
          name="email"
          type="email"
          register={register}
          errors={errors}
        />
        <FormInput
          label="Confirmez votre adresse email"
          name="confirmEmail"
          type="email"
          register={register}
          errors={errors}
        />
        <FormInput
          label="Mot de passe"
          name="password"
          type="password"
          register={register}
          errors={errors}
        />
        <FormInput
          label="Confirmez votre mot de passe"
          name="confirmPassword"
          type="password"
          register={register}
          errors={errors}
        />
        <input type="submit"/>
      </form>
    </Container>
  )
}