import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth'
import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoutes() {
  const { isLoggedIn } = useContext(AuthContext)

  return (
    isLoggedIn ? <Outlet/> : <Navigate to="/login"/>
  )
}