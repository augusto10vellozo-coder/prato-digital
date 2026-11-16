import { useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom'
import { StoreProvider } from './lib/store'
import { Toast } from './components/Toast'
import { Landing } from './pages/Landing'
import { Partners } from './pages/Partners'
import { MenuBuilder } from './pages/MenuBuilder'
import { SiteBuilder } from './pages/SiteBuilder'
import { MenuPage } from './pages/MenuPage'
import { PublicSite } from './pages/PublicSite'
import { NotFound } from './pages/NotFound'
import { PublicBio } from './pages/PublicBio'
import { SignUp } from './pages/SignUp'
import { SignIn } from './pages/SignIn'
import { DemoEntry } from './pages/DemoEntry'
import { RequireAuth } from './components/RequireAuth'
import { AppLayout } from './app/AppLayout'
import { AppDashboard } from './app/pages/Dashboard'
import { AppNewProject } from './app/pages/NewProject'
import { AppProjects } from './app/pages/Projects'
import { AppCrm } from './app/pages/Crm'
import { AppTemplates } from './app/pages/Templates'
import { AppPlans } from './app/pages/Plans'
import { AppSales } from './app/pages/Sales'
import { AppPricing } from './app/pages/Pricing'
import { AppContracts } from './app/pages/Contracts'
import { AppMembers } from './app/pages/Members'
import { AppFirstClient } from './app/pages/FirstClient'
import { AppBio } from './app/pages/Bio'
import { AppBulk } from './app/pages/Bulk'
import { AppAffiliates } from './app/pages/Affiliates'
import { AppFeedback } from './app/pages/Feedback'
import { AppAccount } from './app/pages/Account'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return null
}

function LegacyBuilderRedirect() {
  const { leadId } = useParams()
  return <Navigate to={`/app/projetos/${leadId ?? ''}`} replace />
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <ScrollToTop />
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <Routes>
          <Route path="/app" element={<RequireAuth><AppLayout /></RequireAuth>}>
            <Route index element={<AppDashboard />} />
            <Route path="novo" element={<AppNewProject />} />
            <Route path="projetos" element={<AppProjects />} />
            <Route path="crm" element={<AppCrm />} />
            <Route path="templates" element={<AppTemplates />} />
            <Route path="planos" element={<AppPlans />} />
            <Route path="vendas" element={<AppSales />} />
            <Route path="precificacao" element={<AppPricing />} />
            <Route path="contratos" element={<AppContracts />} />
            <Route path="area-de-membros" element={<AppMembers />} />
            <Route path="primeiro-cliente" element={<AppFirstClient />} />
            <Route path="link-na-bio" element={<AppBio />} />
            <Route path="prospeccao" element={<AppBulk />} />
            <Route path="afiliados" element={<AppAffiliates />} />
            <Route path="feedback" element={<AppFeedback />} />
            <Route path="conta" element={<AppAccount />} />
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Route>

          <Route path="/app/projetos/:leadId" element={<RequireAuth><MenuBuilder /></RequireAuth>} />
          <Route path="/app/sites/:leadId" element={<RequireAuth><SiteBuilder /></RequireAuth>} />

          <Route path="/" element={<Landing />} />
          <Route path="/parceiros" element={<Partners />} />
          <Route path="/criar-conta" element={<SignUp />} />
          <Route path="/entrar" element={<SignIn />} />
          <Route path="/demo" element={<DemoEntry />} />
          <Route path="/c/:slug" element={<MenuPage />} />
          <Route path="/s/:slug" element={<PublicSite />} />
          <Route path="/bio" element={<PublicBio />} />

          <Route path="/painel" element={<Navigate to="/app" replace />} />
          <Route path="/painel/cardapio/:leadId" element={<LegacyBuilderRedirect />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toast />
    </StoreProvider>
  )
}
