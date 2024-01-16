import { useState } from 'react'
import InlineEditInput from '../form/inlineEditInput'
import { ModalButton } from '../styles/generalStyles'
import styled from 'styled-components'
import useLockBodyScroll from '../../hooks/useLockBodyScroll'
import moment from 'moment'
import frLocal from 'moment/locale/fr'


export default function ClickModal({ eventObject, onUpdate, onDelete, touch, setTouch }) {
  useLockBodyScroll()

  moment.locale('fr', [frLocal])

  const [inputValue, setInputValue] = useState(eventObject.title)

  return (
    <ModalContent>
      <div onTouchStart={() => setTouch(!touch)}>
        <h4>
          <InlineEditInput
            initialValue={inputValue}
            setInitialValue={setInputValue}
            name="title"
            onSave={onUpdate}
            setTouch={setTouch}
            touch={touch}
            //{ ...register('title') }
          />
        </h4>
      </div>
      {/*<DateTitle>
        Du { moment(eventObject.start).format('DD/MM/YY à HH:mm') } au { moment(eventObject.end).format('DD/MM/YY à HH:mm') }
      </DateTitle>*/}
      <DateTitle>
        Le {moment(eventObject.start).format('DD MMMM YYYY')} de {moment(eventObject.start).format('HH:mm')} à {moment(eventObject.end).format('HH:mm')}
      </DateTitle>
      <ModalText>
        Pour modifier la date du RDV, veuillez glisser / déposer le RDV ou modifier sa durée en maintenant le clic
        enfoncé sur le bord bas de l'évènement puis faire glisser la souris vers le haut ou le bas.
      </ModalText>
      <ModalButton type="button" onClick={() => onDelete()}>Supprimer</ModalButton>
    </ModalContent>
  )
}

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  
  //& > div > span {
  //  display: flex;
  //  flex-grow: 1;
  //}
`

const DateTitle = styled.h5`
  font-weight: 500;
  margin: 0.75rem 0;
  font-size: 0.75em;
`

const ModalText = styled.p`
  font-size: 0.55em;
`