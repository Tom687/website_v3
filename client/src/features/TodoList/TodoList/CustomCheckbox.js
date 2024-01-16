import React, { useState } from 'react'
import CheckIcon from './checkmark2.png'
import styled from 'styled-components'

const CustomCheckbox = ({ onClick, done }) => {
  const [isChecked, setIsChecked] = useState(false)

  function onChange() {
    if (!done) {
      setIsChecked(false)
    }
    else if (done || isChecked) {
      setIsChecked(false)
    }
    else {
      setIsChecked(!isChecked)
    }
  }

  return (
    <Wrapper
      onClick={onClick}
    >
      <Checkbox
        type="checkbox"
        checked={isChecked}
        onChange={() => onChange()}
      />
      <Checkmark
        isChecked={isChecked || done}
        onClick={() => onChange()}
      ></Checkmark>
    </Wrapper>
  )
}

/*CustomCheckbox.propTypes = {
 onClick: PropTypes.func.isRequired,
 done: PropTypes.bool.isRequired,
 };*/

const Wrapper = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-right: 1.5rem;
  cursor: pointer;

  /* TODO : Pour éviter la sélection du text quand double click sur le checkbox */
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  /* Non-prefixed version, currently
																	 supported by Chrome, Edge, Opera and Firefox */
  /*transition: 1s;*/

  /* TODO NEW */
  display: flex;
  align-items: center;
`

const Checkbox = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`

const Checkmark = styled.span`
  display: inline-block;
  width: 2rem;
  height: 2rem;
  background: white;
  border-radius: 50%;
  border: 1px solid #e6e6e6;
  vertical-align: sub;

  ${props => !props.isChecked} {
    border-color: rgba(186, 224, 189, 0.75);

    &::before {
      display: block;
      content: '';
      position: relative;
      bottom: 5px;
      left: 2px;
      /*background: url('../../assets/img/checkmark2.png');*/
      /*background: url('./checkmark2.png');*/
      background: url(${CheckIcon});
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      width: 2.25rem;
      height: 2.25rem;
    }
  }
`

export default CustomCheckbox