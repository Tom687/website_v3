import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import styled from 'styled-components'
import Logo from '../../assets/logos/logo-noir-blanc.svg'
import useToggle from '../../hooks/useToggle'
import useWindowSize from '../../hooks/useWindowSize'
import useDetectDevice from '../../hooks/useDetectDevice'

export default function Header() {
  const { isLoggedIn, logout } = useContext(AuthContext)

  const { isMobile } = useDetectDevice()

  console.log('isMobile header', isMobile)

  let navigate = useNavigate()
  let location = useLocation()

  const windowSize = useWindowSize()
  const { status: isMenuExpanded, toggleStatus: toggleMenu } = useToggle()

  useEffect(() => {
    if (!isLoggedIn && isMenuExpanded) {
      toggleMenu()
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (isMenuExpanded) {
      toggleMenu()
    }
  }, [location])


  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let oldValue = 0
    let newValue = 0

    const handleScroll = () => {
      newValue = window.scrollY

      //Subtract the two and conclude
      if (oldValue - newValue < 0) {
        setVisible(false)
      }
      else if (oldValue - newValue > 0) {
        setVisible(true)
      }

      // Update the old value
      oldValue = newValue
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  return (
    <>
      {
        ( windowSize.width >= 800 /*&& !isMobile*/ ) &&
        <StyledHeader visible={visible}>

          <nav>
            <LogoImg>
              <img src={Logo} alt="Logo site" width={80}/>
            </LogoImg>
            <ul>
              {
                !isLoggedIn &&
                <>
                  <li>
                    <Link to="/about-me">About me</Link>
                  </li>
                  <li>
                    <Link to="/todos">Todolist</Link>
                  </li>
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link to="/calendar">Calendar</Link>
                  </li>
                  <li>
                    <Link to="/register">S'inscrire</Link>
                  </li>
                  <li>
                    <Link to="/login">Se connecter</Link>
                  </li>
                </>
              }
              {
                isLoggedIn &&
                <>
                  <li>
                    <Link to="/about-me">About me</Link>
                  </li>
                  <li>
                    <Link to="/todos">Todolist</Link>
                  </li>
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link to="/calendar">Calendar</Link>
                  </li>
                  <li>
                    <LogoutButton
                      onClick={() => {
                        logout(() => navigate('/'))
                      }}
                    >
                      Se déconnecter
                    </LogoutButton>
                  </li>
                </>
              }
            </ul>
          </nav>
        </StyledHeader>
      }
      {
        ( windowSize.width < 800 || isMobile ) &&
        <MobileHeader expanded={isMenuExpanded}>
          <nav>
            <LogoImg>
              <img src={Logo} alt="Logo site" width={80}/>
            </LogoImg>
            <ul>
              {
                !isLoggedIn &&
                <>
                  <HamburgerButton.Wrapper onClick={() => toggleMenu()}>
                    <HamburgerButton.Lines/>
                  </HamburgerButton.Wrapper>
                  {
                    isMenuExpanded &&
                    <MobileNav>
                      <li>
                        <Link to="/calendar">Calendar</Link>
                      </li>
                      <li>
                        <Link to="/todos">Todolist</Link>
                      </li>
                      <li>
                        <Link to="/profile">Profile</Link>
                      </li>
                      <li>
                        <Link to="/about-me">About me</Link>
                      </li>
                      <li>
                        <Link to="/register">S'inscrire</Link>
                      </li>
                      <li>
                        <Link to="/login">Se connecter</Link>
                      </li>
                    </MobileNav>
                  }
                </>
              }
              {
                isLoggedIn &&
                <>
                  <HamburgerButton.Wrapper onClick={() => toggleMenu()}>
                    <HamburgerButton.Lines/>
                  </HamburgerButton.Wrapper>

                  {
                    isMenuExpanded &&
                    <MobileNav>
                      <li>
                        <Link to="/about-me">About me</Link>
                      </li>
                      <li>
                        <Link to="/todos">Todolist</Link>
                      </li>
                      <li>
                        <Link to="/profile">Profile</Link>
                      </li>
                      <li>
                        <Link to="/calendar">Calendar</Link>
                      </li>
                      <li>
                        <LogoutButton
                          onClick={() => {
                            logout(() => navigate('/'))
                          }}
                        >
                          Se déconnecter
                        </LogoutButton>
                      </li>
                    </MobileNav>
                  }

                </>
              }
            </ul>
          </nav>
        </MobileHeader>
      }
    </>

  )
}

const HamburgerButton = {
  Wrapper: styled.button`
    height: 3rem;
    width: 3rem;
    position: relative;
    font-size: 12px;

    display: none;

    @media only screen and (max-width: 800px) {
      display: block;
    }

    /* Remove default button styles */
    border: none;
    background: transparent;
    outline: none;

    cursor: pointer;

    &:after {
      content: "";
      display: block;
      position: absolute;
      height: 150%;
      width: 150%;
      top: -25%;
      left: -25%;
    }
  `,
  Lines: styled.div`
    top: 50%;
    margin-top: -0.125em;

    &,
    &:after,
    &:before {
      /* Create lines */
      height: 2px;
      pointer-events: none;
      display: block;
      content: "";
      width: 100%;
      background-color: black;
      position: absolute;
    }

    &:after {
      /* Move bottom line below center line */
      top: -0.8rem;
    }

    &:before {
      /* Move top line on top of center line */
      top: 0.8rem;
    }
  `,
}

const MobileNav = styled.div`
    /*transition: 1s;
	li {
    opacity: ${props => props.expanded ? 1 : 0};
	}*/
`

const LogoImg = styled.div`
  display: flex;
  margin-left: 0.5rem;

  img {
    padding: 0.4rem;
  }
`

const MobileHeader = styled.header`
  nav {
    /*position: fixed;
				top: 0;
				left: 0;
				display: grid;
				height: 80px;
				//background-color: #0070f3;
				width: 100%;
				align-content: center;*/
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background-color: #0070f3;
    color: wheat;
    height: ${props => props.expanded ? '330px' : '70px'};
    white-space: nowrap;

    transition: 0.2s;

    ${LogoImg} img {
      width: ${props => props.expanded ? '140px' : '80px'};
      transition: 0.5s;
    }

    //justify-content: end;
    ul {
      /*margin-left: auto;
									margin-right: auto;
									padding-left: 1rem;
									padding-right: 1rem;
									max-width: 100%;
									display: grid;
									grid-template-columns: repeat(5, 1fr);
									grid-gap: 0.5rem;
									list-style: none;
									height: 100%;*/
      display: flex;
      gap: 0.5rem;
      font-size: 1.15rem;
      align-items: baseline;
    }

    ul li {
      padding: 5px 14px;
      display: flex;
    }

    a {
      color: white;
      text-decoration: none;
      width: 100%;
      height: 44px;
      display: flex;
      align-items: center;
        //opacity: ${props => props.expanded ? 1 : 0};
    }

    button {
      white-space: nowrap;
      margin-right: 0.25rem;
    }

  }

  // xs
  @media (min-width: 0) {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 10;
  }
  // sm
  @media (min-width: 800px) {
    display: none;
    position: unset;
  }
  // md
  @media (min-width: 1024px) {
    position: unset;
    font-size: 1.25em;
    display: none;
  }
`

const StyledHeader = styled.header`
  //display: flex;
  //flex-direction: column;
  ////align-items: center;
  //background-color: #0070f3;
  //height: 70px;
  margin-bottom: 5rem;
  z-index: 10;

  nav {
    /*position: fixed;
				top: 0;
				left: 0;
				display: grid;
				height: 80px;
				//background-color: #0070f3;
				width: 100%;
				align-content: center;*/
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background-color: #0070f3;
    color: wheat;
    height: 70px;
    position: fixed;
    top: 0;
    transition: top 0.3s;
    width: 100%;
    z-index: 10;
    white-space: nowrap;
    //justify-content: end;
      //${props => props.visible ? `
      top: 0;
    ` : `
      top: -70px;
    `}

    ul {
      /*margin-left: auto;
									margin-right: auto;
									padding-left: 1rem;
									padding-right: 1rem;
									max-width: 100%;
									display: grid;
									grid-template-columns: repeat(5, 1fr);
									grid-gap: 0.5rem;
									list-style: none;
									height: 100%;*/
      display: flex;
      gap: 0.25rem;
      font-size: 1.15rem;
      align-items: baseline;
    }

    ul li {
      padding: 5px 14px;
    }

    a {
      color: white;
      text-decoration: none;
    }

    button {
      white-space: nowrap;
    }
  }

  // xs
  @media (min-width: 0) {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 10;
  }
  // sm
  @media (min-width: 600px) {
    position: unset;
  }
  // md
  @media (min-width: 1024px) {
    position: unset;
    font-size: 1.25em;
  }
`

const StyledNav = styled.nav`
  /*position: fixed;
		top: 0;
		left: 0;
			display: grid;
			height: 80px;
		//background-color: #0070f3;
			width: 100%;
			align-content: center;*/
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #0070f3;
  color: wheat;
  height: 70px;

  //justify-content: end;

  ul {
    /*margin-left: auto;
		margin-right: auto;
		padding-left: 1rem;
		padding-right: 1rem;
		max-width: 100%;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-gap: 0.5rem;
		list-style: none;
		height: 100%;*/
    display: flex;
    gap: 1rem;
    font-size: 1.25rem;
    align-items: baseline;
  }

  ul li {
    padding: 5px 14px;
  }

  a {
    color: white;
    text-decoration: none;
  }

  // xs
  @media (min-width: 0) {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 10;
  }
  // sm
  @media (min-width: 600px) {
  }
  // md
  @media (min-width: 1024px) {
    position: unset;
  }
`

const LogoutButton = styled.button`
  background-color: #4CAF50;
  border: none;
  border-radius: 4px;
  color: white;
  padding: 0.5rem 1rem;

  text-decoration: none;
  display: flex;
  font-size: 1rem;
  white-space: nowrap;
  margin: 0 !important;
`