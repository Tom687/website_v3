import { lazy } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import getGoogleOAuthUrl from '../../utils/getGoogleOAuthUrl'
import styled from 'styled-components'
import { GoogleLoginButton } from 'react-social-login-buttons'
import { useForm } from 'react-hook-form'
import { Container } from '../styles/generalStyles'

const FormInput = lazy(() => import('../form/formInput'))


export default function LoginPage() {
  let navigate = useNavigate()

  const { formState: { errors }, register, handleSubmit } = useForm()

  const [rememberMe, setRememberMe] = useState(false)

  const { isLoggedIn, login } = useContext(AuthContext)

  async function onSubmit(values) {
    const { email, password, rememberMe } = values

    // TODO : Voir pour mettre navigate() ici et pas dans context
    const loginSuccess = await login({ email, password, rememberMe })
    if (loginSuccess) {
      navigate('/', { replace: true })
    }
  }

  return (
    <Container>
      <h1>Se connecter</h1>
      {
        !isLoggedIn &&
        <div>
          <LoginForm onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              label="Adresse email"
              name="email"
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
            {/*<FormInput
							label="Rester connecté"
							name="rememberMe"
							type="checkbox"
							register={register}
							errors={errors}
							style={{ display: 'flex', flexDirection: 'row' }}
						/>*/}
            {/*<InputGroup>
							<label  htmlFor="rememberMe">Rester connecté</label>
							<input
								type="checkbox"
								name="rememberMe"
								id="rememberMe"
								{ ...register("rememberMe") }
							/>
						</InputGroup>*/}
            <RememberMeCheckbox
              label="Rester connecté"
              name="rememberMe"
              type="checkbox"
              register={register}
              errors={errors}
              className="rememberMe"
            />
            {/*<InputGroup>
							<label htmlFor="rememberMe">Rester connecté</label>
							<input
								type="checkbox"
								id="rememberMe"
								checked={rememberMe}
								onChange={() => setRememberMe(!rememberMe)}
							/>
						</InputGroup>*/}
            <SubmitButton type="submit">Se connecter</SubmitButton>
          </LoginForm>

          <SectionBlock>
            <h4>Mot de passe oublié ?</h4>
            <Link to="/forgotPassword">Modifier mon mot de passe</Link>
          </SectionBlock>

          <SocialButtonsDiv>
            {/*<h3>Se connecter avec Google</h3>*/}
            <a href={getGoogleOAuthUrl()}>
              <GoogleLoginButton>Se connecter avec Google</GoogleLoginButton>
            </a>
          </SocialButtonsDiv>


        </div>
      }
    </Container>
  )
}

const SectionBlock = styled.section`
    display: flex;
    flex-direction: row;
    align-items: end;

    h4 {
        margin-right: 1rem;
    }
`

const LoginForm = styled.form`
    margin-bottom: 2rem;
`

const SubmitButton = styled.button`
    /*border: none;
    border-radius: 20px;
    background: #61dafb;*/
`

const SocialButtonsDiv = styled.div`
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    width: fit-content;

    button {
        display: flex;
    }
`

const GoogleLink = styled.a`
    background-color: lightblue;
    color: black;
    text-decoration: none;
    padding: 0.5rem;
    border: 1px solid;
    border-radius: 0.25rem;
`

const RememberMeCheckbox = styled(FormInput)`
    display: flex;
    flex-direction: row !important;
    align-items: center;
    //flex-wrap: wrap;
    margin-bottom: 2rem;

    label {
        margin: 0;
        white-space: nowrap;
    }

    input {
        /*display: flex;
        flex-direction: row;*/
        height: 20px;
        width: 10% !important;
    }
`