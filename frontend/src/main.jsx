// frontend/src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// Router'ı import et
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Uygulamayı BrowserRouter ile sarmala */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)