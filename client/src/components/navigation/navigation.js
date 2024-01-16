import {
  Routes,
  Route,
} from 'react-router-dom'
import { Suspense, lazy } from 'react'
import LoadingSpinner from '../../assets/icons/rolling.svg'
import Layout from '../layout/layout'
import PrivateRoutes from '../layout/privateRoutes'

const LoginPage = lazy(() => import('../auth/login'))
const RegisterForm = lazy(() => import('../auth/registerForm'))
const ForgotPassword = lazy(() => import('../auth/forgotPassword'))
const ResetPassword = lazy(() => import('../auth/resetPassword'))
const Profile = lazy(() => import('../profile/profile'))
const Calendar = lazy(() => import('../calendar/calendar'))
const Todolist = lazy(() => import('../todolist/todolist'))
const AboutMe = lazy(() => import('../aboutMe/aboutMe'))

export default function Navigation() {
  return (
    <>
      <Suspense fallback={<img src={LoadingSpinner} style={{ margin: '0 auto' }} alt="Loading Spinner"/>}>
        <Routes>
          <Route element={<Layout/>}>

            <Route path="/" element={<AboutMe/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/calendar" element={<Calendar/>}/>
            <Route path="/todos" element={<Todolist/>}/>
            <Route path="/about-me" element={<AboutMe/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterForm/>}/>
            <Route path="/forgotPassword" element={<ForgotPassword/>}/>
            <Route path="/resetPassword/:token" element={<ResetPassword/>}/>
            <Route element={<PrivateRoutes/>}>
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/calendar" element={<Calendar/>}/>
              <Route path="/todos" element={<Todolist/>}/>
            </Route>
            {/*<Route
							path="/protected"
							element={
								<RequireAuth>
									<ProtectedPage />
								</RequireAuth>
							}
						/>*/}
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}