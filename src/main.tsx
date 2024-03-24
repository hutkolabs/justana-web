import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { ToastContainer } from 'react-toastify'
import { CircleProvider, InfoProvider } from './providers'


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CircleProvider>
      <InfoProvider>
      <App />
      <ToastContainer />
      </InfoProvider>
    </CircleProvider>
  </React.StrictMode>,
)
