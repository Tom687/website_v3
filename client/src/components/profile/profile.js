import { lazy } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth'
import { useSnackbar } from 'notistack'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { colors3, Container, TextParagrah } from '../styles/generalStyles'
import styled from 'styled-components'

const AuthDoc = lazy(() => import('../auth/authDoc'))
const InlineEditInput = lazy(() => import('../form/inlineEditInput'))

export default function Profile() {
  const { user, setUser } = useContext(AuthContext)
  const { enqueueSnackbar } = useSnackbar()

  const onUpdate = async (e) => {
    try {
      const { name, value } = e

      const res = await axios.patch(`/users/${user.id}`, {
        [name]: value,
      }, {
        withCredentials: true,
      })

      if (res.status === 200 || res.data.status === 'success') {
        console.log('success updated')
        setUser({
          ...user,
          ...res.data.updated,
        })
      }
    }
    catch (err) {
      if (err.response) {
        enqueueSnackbar(err.response.data.message || 'Une erreur est survenue')
      }
      console.log('Err onUpdate Profile :', err)
    }
  }

  return (
    <>
      <Container>
        <h2>Système d'authentification / autorisation :</h2>

        <InlineEditInputBorder
          initialValue={user.name}
          setInitialValue={setUser}
          name="name"
          onSave={onUpdate}
        />
        <InlineEditInputBorder
          initialValue={user.email}
          setInitialValue={setUser}
          name="email"
          onSave={onUpdate}
        />
        <TextParagrah>
          Double clickez sur les 2 champs ci-dessus, ils sont éditables ! (A condition d'être connecté au système, sinon
          les champs ne s'affichent pas).
        </TextParagrah>
        <div>
          <Link to="/forgotPassword">Modifier votre mot de passe</Link>
        </div>

        <br/>

      </Container>

      <AuthDoc/>
    </>
  )
}

const InlineEditInputBorder = styled(InlineEditInput)`
	input {
		border: 3px solid ${colors3.blue.light}!important;
	}
`