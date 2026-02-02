import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/Dashboard.css'
import './styles/Landing.css'
import './styles/Auth.css'
import './styles/Search.css'
import './styles/Appointments.css'
import './styles/Profile.css'
import './styles/Records.css'
import './styles/Layout.css'
import './styles/Booking.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
