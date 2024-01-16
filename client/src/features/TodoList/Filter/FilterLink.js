import React from 'react'
import styled from 'styled-components'
import { Button, colors3 } from '../../../components/styles/generalStyles'

const FilterLink = ({ filter, onClick, activeFilter, children }) => {

  return (
    <StyledButton
      onClick={onClick}
      isActive={activeFilter === filter}
    >
      {children}
    </StyledButton>
  )
}

/*FilterLink.propTypes = {
 filter: PropTypes.oneOf([
 'SHOW_ALL',
 'SHOW_ACTIVE',
 'SHOW_COMPLETED'
 ]).isRequired,
 activeFilter: PropTypes.oneOf([ // TODO : Comment mettre null ? Retirer isRequired ?
 'SHOW_ALL',
 'SHOW_ACTIVE',
 'SHOW_COMPLETED'
 ]),
 onClick: PropTypes.func.isRequired,
 children: PropTypes.string.isRequired,
 };*/

const StyledButton = styled(Button)`
  cursor: pointer;
  font-size: 1rem;
  padding: 0.1rem 0.25rem;
  border: 1.55px solid transparent;
  border-radius: 3px;
  margin: 0 0.2rem;
  //display: flex;
  //flex-direction: column;

  &:hover {
    border: 1.55px solid ${colors3.blue.light};
  }
  
  ${props => !props.isActive} {
    border: 1.55px solid ${colors3.blue.light};
    background-color: ${colors3.blue.darker};

    &:focus {
      //outline: none;
      background-color: ${colors3.blue.darker}
    }
  }
`

export default FilterLink