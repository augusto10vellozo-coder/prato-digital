import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { StoreProvider } from './lib/store'
import { Toast } from './components/Toast'
import { RequireAuth } from './components/RequireAuth'
import { AppLayout } from './app/AppLayout'
import { Landing } from './pages/Landing'

const Partners = lazy(() => import('./pages/Partners').then((m) => ({ default: m.Partners })))
const MenuBuilder = lazy(() => import('./pages/MenuBuilder').then((m) => ({ default: m.MenuBuilder })))
const SiteBuilder = lazy(() => import('./pages/SiteBuilder').then((m) => ({ default: m.SiteBuilder })))
const MenuPage = lazy(() => import('./pages/MenuPage').then((m) => ({ default: m.MenuPage })))
const PublicSite = lazy(() => import('./pages/PublicSite').then((m) => ({ default: m.PublicSite })))
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))
const PublicBio = lazy(() => import('./pages/PublicBio').then((m) => ({ default: m.PublicBio })))
const SignUp = lazy(() => import('./pages/SignUp').then((m) => ({ default: m.SignUp })))
const SignIn = lazy(() => import('./pages/SignIn').then((m) => ({ default: m.SignIn })))
const DemoEntry = lazy(() => import('./pages/DemoEntry').then((m) => ({ default: m.DemoEntry })))

const AppDashboard = lazy(() =>
  import('./app/pages/Dashboard').then((m) => ({ default: m.AppDashboard })),
)
const AppNewProject = lazy(() =>
  import('./app/pages/NewProject').then((m) => ({ default: m.AppNewProject })),
)
const AppProjects = lazy(() =>
  import('./app/pages/Projects').then((m) => ({ default: m.AppProjects })),
)
const AppCrm = lazy(() => import('./app/pages/Crm').then((m) => ({ default: m.AppCrm })))
const AppTemplates = lazy(() =>
  import('./app/pages/Templates').then((m) => ({ default: m.AppTemplates })),
)
const AppPlans = lazy(() => import('./app/pages/Plans').then((m) => ({ default: m.AppPlans })))
const AppSales = lazy(() => import('./app/pages/Sales').then((m) => ({ default: m.AppSales })))
const AppPricing = lazy(() =>
  import('./app/pages/Pricing').then((m) => ({ default: m.AppPricing })),
)
const AppContracts = lazy(() =>
  import('./app/pages/Contracts').then((m) => ({ default: m.AppContracts })),
)
const AppMembers = lazy(() =>
  import('./app/pages/Members').then((m) => ({ default: m.AppMembers })),
)
const AppFirstClient = lazy(() =>
  import('./app/pages/FirstClient').then((m) => ({ default: m.AppFirstClient })),
)
const AppBio = lazy(() => import('./app/pages/Bio').then((m) => ({ default: m.AppBio })))
const AppBulk = lazy(() => import('./app/pages/Bulk').then((m) => ({ default: m.AppBulk })))
const AppAffiliates = lazy(() =>
  import('./app/pages/Affiliates').then((m) => ({ default: m.AppAffiliates })),
)
const AppFeedback = lazy(() =>
  import('./app/pages/Feedback').then((m) => ({ default: m.AppFeedback })),
)
const AppAccount = lazy(() =>
  import('./app/pages/Account').then((m) => ({ default: m.AppAccount })),
)

function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: '60vh',
        fontFamily: 'inherit',
        letterSpacing: '0.02em',
      }}
    >
      Carregando…
    </div>
  )
}

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
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
        <ScrollToTop />
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/app"
              element={
                <RequireAuth>
                  <AppLayout />
                </RequireAuth>
              }
            >
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

            <Route
              path="/app/projetos/:leadId"
              element={
                <RequireAuth>
                  <MenuBuilder />
                </RequireAuth>
              }
            />
            <Route
              path="/app/sites/:leadId"
              element={
                <RequireAuth>
                  <SiteBuilder />
                </RequireAuth>
              }
            />

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
        </Suspense>
      </BrowserRouter>
      <Toast />
    </StoreProvider>
  )
}
