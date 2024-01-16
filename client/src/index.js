import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'

import AuthContextProvider from './contexts/auth'
import { SnackbarProvider } from 'notistack'
import store from './utils/store'
import { Provider } from 'react-redux'
import axios from 'axios'

import './styles/reset.css'
import './index.css'

const baseURL =
  process.env.NODE_ENV === 'production'
    ? '/api'
    : 'http://localhost:1337/api'

axios.defaults.baseURL = baseURL //`http://localhost:1337/api`;
/*axios.defaults.headers = {
	authorization: `Bearer ${accessToken}`,
}*/
axios.defaults.withCredentials = true

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <SnackbarProvider>
    <AuthContextProvider>
      <Provider store={store}>
        <BrowserRouter basename="/">
          <App/>
        </BrowserRouter>
      </Provider>
    </AuthContextProvider>
  </SnackbarProvider>,
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
