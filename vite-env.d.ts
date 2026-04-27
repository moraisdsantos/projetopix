import React from 'react'
import ReactDOM from 'react-dom/client'
import { FinancialDashboard } from './components/FinancialDashboard'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FinancialDashboard />
  </React.StrictMode>,
)
