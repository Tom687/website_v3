import React, { lazy, useState } from 'react';
import { setVisibilityFilter, VisibilityFilters } from './FilterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectUndoneTodosNumber } from '../TodoList/TodoSlice';
import styled from 'styled-components';

const FilterLink = lazy(() => import('./FilterLink'));

const Footer = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const dispatch = useDispatch();

  const undoneTodosNumber = useSelector(selectUndoneTodosNumber);
  const todosLeftWord = undoneTodosNumber > 1 ? 'tâches restantes' : 'tâche restante';

  function toggleFilter(filter) {
    setActiveFilter(filter);
    dispatch(setVisibilityFilter(filter));
  }

  return (
    <FooterWrapper>
      <UndoneTodoNb>
        {undoneTodosNumber || 'Aucune'} {todosLeftWord}
      </UndoneTodoNb>
      <div>
        <FilterLink
          filter={VisibilityFilters.SHOW_ALL}
          onClick={() => toggleFilter(VisibilityFilters.SHOW_ALL)}
          activeFilter={activeFilter}
        >
          Tous
        </FilterLink>
        <FilterLink
          filter={VisibilityFilters.SHOW_COMPLETED}
          onClick={() => toggleFilter(VisibilityFilters.SHOW_COMPLETED)}
          activeFilter={activeFilter}
        >
          Faits
        </FilterLink>
        <FilterLink
          filter={VisibilityFilters.SHOW_ACTIVE}
          onClick={() => toggleFilter(VisibilityFilters.SHOW_ACTIVE)}
          activeFilter={activeFilter}
        >
          A faire
        </FilterLink>
      </div>

    </FooterWrapper>
  );
};

const FooterWrapper = styled.footer`
  //text-align: center;
  border: 1px solid #e6e6e6;
  border-radius: 0 0 5px 5px;
  padding: 0.75rem 1rem;
  position: relative;
  font-size: 14px;
  display: flex;
  justify-content: space-between;

  div:nth-child(2) {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  @media (min-width: 600px) {
    justify-content: right;
  }
`;

export const UndoneTodoNb = styled.div`
  display: flex;
  flex-basis: max-content;
  padding-left: 0;

  @media (min-width: 600px) {
    position: absolute;
    left: 1.25rem;
    padding-top: 3px;
  }
`;

export default Footer;