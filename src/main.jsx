import React from 'react'
import ReactDOM from 'react-dom/client'
import ReactGA from "react-ga4";
import App from './App.jsx'
import './index.css'

// IMPORTANT: Replace with your Measurement ID
const GA_MEASUREMENT_ID = "G-V53F4K7VHG"; 
ReactGA.initialize(GA_MEASUREMENT_ID);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
