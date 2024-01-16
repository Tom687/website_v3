import React, { useCallback, useContext, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { editTodo, removeTodo, toggleTodo } from './TodoSlice'
import CustomCheckbox from './CustomCheckbox'
import axios from 'axios'
import InlineEditInput from '../../../components/form/inlineEditInput'
import styled from 'styled-components'
import { AuthContext } from '../../../contexts/auth'
import { removeObjectFromStore, updateIDBData } from '../../../utils/indexedDB'
import moment from 'moment'
import { Button, colors3 } from '../../../components/styles/generalStyles'

const TodoItem = ({ id, text, todo, onEditingTodo, isTouchDevice }) => {
  const { isLoggedIn } = useContext(AuthContext)
  const dispatch = useDispatch()

  const [isEditingActive, setIsEditingActive] = useState(false)

  const wrapperRef = useRef(null)

  const handleTodoDblClick = useCallback(
    () => setIsEditingActive(true),
    [setIsEditingActive],
  )

  // TODO : Pour si newTodoText.length == 0 le todo n'est pas supprimé ?
  // TODO : Y'a t'il un intérêt à utiliser useCallback ici ? Permet de ne pas avoir le warning "promise not used" mais
  // à part ça ?
  const onEdit = useCallback(async (newTodoText) => {
    try {
      if (newTodoText.value.length === 0) {
        if (!isLoggedIn) {
          removeObjectFromStore('userTodos', todo.id)
          dispatch(removeTodo(todo.id))
        }
        else {
          const res = await axios.delete('/todos/' + todo.id)

          if (res.status === 200 || res.data.status === 'success') {
            dispatch(removeTodo(todo.id))
          }
        }
      }
      else {
        if (!isLoggedIn) {
          updateIDBData('userTodos', Number(todo.id), newTodoText.name, newTodoText.value.trim())

          dispatch(editTodo({ id: todo.id, text: newTodoText.value.trim() }))

          setIsEditingActive(false)
        }
        else {
          const res = await axios.put('/todos/' + todo.id, {
            [newTodoText.name]: newTodoText.value.trim(),
          })

          if (res.status === 200 || res.data.status === 'success') {
            dispatch(editTodo({ id: todo.id, text: newTodoText.value.trim() }))

            setIsEditingActive(false)
          }
        }
      }
    }
    catch (err) {
      console.error('Err edit todo', err)
    }
  }, [])

  const deleteTodo = async () => {
    try {
      if (!isLoggedIn) {
        removeObjectFromStore('userTodos', todo.id)
        dispatch(removeTodo(todo.id))
      }
      else {
        const res = await axios.delete('/todos/' + todo.id)

        if (res.status === 200 || res.data.status === 'success') {
          dispatch(removeTodo(todo.id))
        }
      }
    }
    catch (err) {
      console.error('Err deleteTodo', err)
    }
  }

  const changeTodoStatus = async () => {
    try {
      const status = !todo.completed
      let done_on

      // TODO : Fixer la date pour avoir la bonne du client (ici on a -1h avec new Date())
      if (status) {
        done_on = moment().format('YYYY-MM-DD HH:mm:ss')
      }
      else {
        done_on = null
      }

      if (!isLoggedIn) {
        updateIDBData('userTodos', todo.id, 'completed', !todo.completed)
        updateIDBData('userTodos', todo.id, 'doneOn', done_on)

        dispatch(toggleTodo(todo.id))
      }
      else {
        const res = await axios.put(`/todos/${todo.id}`, {
          completed: !todo.completed,
          done_on,
        })

        if (res.status === 200 || res.data.status === 'success') {
          dispatch(toggleTodo(todo.id))
        }
      }
    }
    catch (err) {
      console.error('Err changeTodoStatus', err)
    }
  }

  const [inputValue, setInputValue] = useState(text)

  return (
    <ItemWrapper
      ref={wrapperRef}
      completed={todo.completed}
      isEditing={isEditingActive}
      onDoubleClick={handleTodoDblClick}
      todo={todo}
    >
      <CustomCheckbox
        onClick={() => changeTodoStatus()}
        done={todo.completed}
      />
      <InlineEditInput
        initialValue={inputValue}
        setInitialValue={setInputValue}
        name="title"
        onSave={onEdit}
        deleteIfEmpty={true}
        //{ ...register('title') }
      />
      <DeleteButton
        className="delete-todo"
        onClick={() => deleteTodo()}
      >
        &times;
      </DeleteButton>
    </ItemWrapper>
  )
}

/*TodoItem.propTypes = {
 todo: PropTypes.shape({
 id: PropTypes.number.isRequired,
 text: PropTypes.string.isRequired,
 completed: PropTypes.bool.isRequired
 }).isRequired
 };*/
const DeleteButton = styled(Button)`
  //display: ${props => props.isTouchDevice ? 'flex' : 'none'};
  display: flex;
  color: ${colors3.red.primary};
  font-size: 1em;
  font-weight: 400;
  text-decoration: none;
  cursor: pointer;
  background-color: transparent;
  border: none;
  position: relative;
  bottom: 1px;
  //left: 2.25rem;

  &:hover {
    color: #af5b5e;
    background-color: transparent;
  }

  @media(min-width: 0) {
    padding: 0.5rem 1rem;
    //margin: 0;
    margin-right: 0.25rem;
  }
`

const ItemWrapper = styled.li`
  cursor: pointer;
  position: relative;
  font-size: 1.5em;
  transition: color 0.35s;
  border-bottom: 1px solid #e6e6e6;
  padding: 0.5rem  1rem;
  padding-right: 0.5rem;
  /*height: 63px;*/
  font-weight: 300;
  line-height: 1.4;
  display: flex;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  ${props => !props.todo.completed} {
    div :not([type=button]) {
      text-decoration: line-through rgba(222, 72, 72, 0.65);
      color: #d9d9d9;
      transition: color 0.35s;  
    }
    
    input {
      text-decoration: none;
    }
    
  }

  @media (min-width: 0) {
    div {
      //max-width: 70%;
      overflow-wrap: anywhere;
    }
  }

  ${props => !props.isEditing} {
    input[type="text"] {
      /*margin-left: 3.5rem;*/
      /*height: fit-content;*/
      /*width: 100%;
			\theight: 100%;*/
      line-height: 1.4;
      border: 1px solid #999;
      -webkit-box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
      box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      padding-left: 0.95rem;
      /*padding-bottom: 3px;*/
      /* TODO : Normalement pas besoin de pos:r et bottom:40px pour que l'input soit centré */
      position: relative;
      display: flex;
      /*flex-grow: 1;*/
      width: 95%;
      /*bottom: 40px;*/
      align-self: center;
      height: 100%;
      text-decoration: none;
      color: black
    }

    input:focus {
      outline: none;
    }
  }

  label {
    display: inline-block;
    width: 90%;
  }
`


export default TodoItem