import { Outlet } from 'react-router-dom'
import { lazy } from 'react'
import styled from 'styled-components'

const Header = lazy(() => import('../header/header'))

export default function Layout({ children }) {
  return (
    <>
      <Header/>
      <MainContainer>
        <Outlet/>
        {children}
      </MainContainer>
    </>
  )
}

const MainContainer = styled.main`
  /*padding: 2.5em;
  text-align: start;
  margin: 0;*/
`