import { lazy } from 'react'
import styled from 'styled-components'
import { Container, TextParagrah } from '../styles/generalStyles'

const AddTodoForm = lazy(() => import('../../features/TodoList/TodoList/AddTodoForm'))
const TodoList = lazy(() => import('../../features/TodoList/TodoList/TodoList'))
const Footer = lazy(() => import('../../features/TodoList/Filter/Footer'))
const TodoDoc = lazy(() => import('./todoDoc'))

export default function Todolist() {

  return (
    <>

      <Container>
        <h1>Todolist PERN stack :</h1>
        <TextParagrah>
          Si vous vous connectez via le système de connection, vos todos seront enregistrés en base de données
          PostgresSQL. Si vous n'êtes pas connecté, ils seront enregistrés dans indexedDB.
        </TextParagrah>
        <Todos>
          <AddTodoForm/>
          <TodoList/>
          <Footer/>
        </Todos>
      </Container>

      <TodoDoc/>
    </>

  )
}

const Todos = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  margin-top: 2.35rem;
  /*display: flex;
	flex-direction: column;
	align-items: center;*/
  max-width: 600px;
  /* TODO : Général pas pris en compte (override par les autres .css) */
  line-height: 1.4;
  font: 16px 'Helvetica Neue', Helvetica, Arial, sans-serif;
`