import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/base.css'
import './styles/site.css'
import './styles/menu.css'
import './styles/panel.css'
import './styles/app.css'
import './styles/site-view.css'
import './styles/wizard.css'
import './styles/auth.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
