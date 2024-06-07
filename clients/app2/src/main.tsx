import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
const isLogin = (document.cookie as string).includes('x-login=1')

if (!isLogin) {
  location.href = '/api/login'
  // location.href = '/api/login/oauth/authorize'
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
