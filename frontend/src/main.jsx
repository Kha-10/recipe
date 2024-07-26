import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { AuthContextProvider } from './contexts/authContext.jsx';
import Routes from './routes/index'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <Routes/>
    </AuthContextProvider>
  </React.StrictMode>,
)
