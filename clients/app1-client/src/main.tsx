import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
const token = localStorage.getItem('token')
if (!token) {
  if (location.pathname !== '/login') {
    location.href = '/api/auth/login'
  }
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
