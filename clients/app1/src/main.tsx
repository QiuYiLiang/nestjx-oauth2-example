import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
const token = localStorage.getItem('token')
if (!token) {
  location.href = '/api/auth/baseLogin'
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
