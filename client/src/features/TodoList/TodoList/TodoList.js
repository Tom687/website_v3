import React, { useEffect, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTodosFromDB, removeAllTodos, selectVisibleTodos } from './TodoSlice'
import axios from 'axios'
import TodoItem from './TodoItem'
import { AuthContext } from '../../../contexts/auth'
import styled from 'styled-components'
import { getAllIDBStoreData } from '../../../utils/indexedDB'
import useDetectDevice from '../../../hooks/useDetectDevice'

const TodoList = () => {
  const { user, isLoggedIn } = useContext(AuthContext)

  const dispatch = useDispatch()
  let todos = useSelector(selectVisibleTodos)

  const { isMobile } = useDetectDevice()

  const getDBTodos = async () => {
    try {
      if (!isLoggedIn) {
        //const todosCount = await countIDBData('userTodos');
        //console.log({todosCount})
        //if (todosCount > 0) {
        const todos = await getAllIDBStoreData('userTodos')

        for (let i in todos) {
          dispatch(addTodosFromDB(todos[i]))
        }
        //}
      }
      else {
        const res = await axios.get('/me/todos')

        if (res.status === 200 || res.data.status === 'success') {
          todos = res.data.todos
          // TODO : Dispatch tous les todos d'un coup au lieu de loop un à un
          for (let i in todos) {
            dispatch(addTodosFromDB(todos[i]))
          }
        }
      }
    }
    catch (err) {
      console.error('ERR GETDBTODOS', err)
    }
  }

  useEffect(() => {
    if (user) {
      dispatch(removeAllTodos())
      getDBTodos()
    }
  }, [])


  const newTodo = (todo) => {
    return (
      <TodoItem
        key={todo.id}
        id={todo.id}
        text={todo.text}
        todo={todo}
        isMobile={isMobile}
      />
    )
  }

  return (
    <ListContainer>
      {/*<li>*/}
      {
        todos.map(newTodo)
      }
      {/*</li>*/}
    </ListContainer>
  )
}

const ListContainer = styled.div`
  width: 100%;
  border: 1px solid #e6e6e6;
  border-bottom: none;
`

export default TodoList