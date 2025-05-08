import { StrictMode } from 'react'
import React, { createRoot } from 'react-dom/client'
import './index.css' // Ensure this is imported
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)