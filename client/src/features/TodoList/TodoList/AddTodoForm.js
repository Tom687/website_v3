import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { addTodo, selectAllTodos, selectUndoneTodosNumber, toggleAllTodos } from './TodoSlice'
import styled from 'styled-components'
import { AuthContext } from '../../../contexts/auth'
import { addDataToIDBStore, updateIDBData } from '../../../utils/indexedDB'
import moment from 'moment'
import { colors3 } from '../../../components/styles/generalStyles'

const AddTodoForm = () => {
  const { isLoggedIn } = useContext(AuthContext)
  const [todo, setTodo] = useState('')

  let allTodos = useSelector(selectAllTodos)

  const undoneTodosNumber = useSelector(selectUndoneTodosNumber)
  const [toggle, setToggle] = useState(false)

  useEffect(() => {
    if (undoneTodosNumber === 0) {
      setToggle(false)
    }
    else {
      setToggle(true)
    }
  }, [undoneTodosNumber])

  const dispatch = useDispatch()


  // TODO : Ajouter createdOn et doneOn dans Redux
  async function submitTodo(e) {
    e.preventDefault()

    if (!todo.trim()) {
      return
    }

    try {
      if (!isLoggedIn) {
        const todoId = await addDataToIDBStore('userTodos', {
          title: todo.trim(),
          completed: false,
          createdOn: moment().format('YYYY-MM-DD HH:mm:ss'),
        })

        dispatch(addTodo({ id: todoId, text: todo.trim() }))

        setTodo('')
      }
      else {
        const response = await axios.post('/todos', {
          title: todo.trim(),
        })

        if (response.data.status === 'success' || response.status === 201) {
          dispatch(addTodo({ text: todo.trim(), id: response.data.id }))
          setTodo('')
        }
      }
    }
    catch (err) {
      if (err.response) {
        console.log('ERR.RES', err.response)
      }
      console.error('ERROR SUBMIT TODO BACKEND : ', err)
    }
  }

  const toggleAll = async () => {
    const isCompleted = toggle

    try {
      if (!isLoggedIn) {
        allTodos.forEach(todo => {
          if (isCompleted) {
            updateIDBData('userTodos', todo.id, 'completed', true)
            updateIDBData('userTodos', todo.id, 'doneOn', moment().format('YYYY-MM-DD HH:mm:ss'))
          }
          else {
            updateIDBData('userTodos', todo.id, 'completed', false)
            updateIDBData('userTodos', todo.id, 'doneOn', null)
          }
        })

        dispatch(toggleAllTodos())
      }
      else {
        const res = await axios.put('/todos', {
          completed: toggle,
          done_on: isCompleted ? moment().format('YYYY-MM-DD HH:mm:ss') : null,
        })

        if (res.status === 200 || res.data.status === 'success') {
          dispatch(toggleAllTodos())
        }
      }

    }
    catch (err) {
      if (err.response) {
        console.log('ERR.RES toggleAll() AddTodoForm', err.response)
      }
      console.error('ERROR toggleAll() AddTodoForm : ', err)
    }
  }

  return (
    <HeaderWrapper>
      <ToggleButton
        onClick={() => toggleAll()}
      >❯</ToggleButton>
      <StyledForm
        onSubmit={(e) => submitTodo(e)}
        id="add-todo-form"
      >
        <input
          type="text"
          placeholder="Ajouter une chose à faire"
          id="add-todo-input"
          name="todo"
          onChange={e => setTodo(e.target.value)}
          value={todo}
        />
      </StyledForm>
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.div`
  position: relative;
`

const ToggleButton = styled.button`
  cursor: pointer;
  color: rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 0;
  left: 8px;
  font-size: 1.5rem;
  height: 47px;
  width: 47px;
  transform: rotate(90deg);

  &:hover {
    color: ${colors3.red.light};
    transform: rotate(90deg) scale(1.1);
    transition: 0.25s;
  }

  &:focus {
    outline: none;
    //color: rgba(175, 91, 94, 0.6);
    color: ${colors3.red.light};
  }

  background-color: transparent;
  border: 1px solid transparent;
`

const StyledForm = styled.form`
  width: 100%;
  text-align: center;

  > input {
    width: 100%;
    border: 1px solid #e6e6e6;
    -webkit-box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
    padding: 0.5rem 1rem;
    font-size: 1.5rem;
    font-weight: 300;
    padding-left: 4.5rem;
  }

  > input:focus {
    /*outline-color: #af3b5e;*/ /* rgba(175, 59, 94, 1) */
    outline: none;
    background-color: rgba(175, 91, 94, 0.3); /* rgba(175, 91, 94, 1) */
  }
`

export default AddTodoForm