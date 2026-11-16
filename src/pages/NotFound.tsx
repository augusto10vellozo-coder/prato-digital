import { Link } from 'react-router-dom'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { Icon } from '../components/Icon'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function NotFound() {
  useDocumentTitle('Página não encontrada — Prato Digital')

  return (
    <div className="site">
      <SiteHeader />
      <main id="conteudo">
        <section className="section">
          <div className="wrap">
            <div className="section__head">
              <h1 className="section__title">
                Essa edição <span className="red">não saiu.</span>
              </h1>
              <div className="section__note">Erro 404</div>
            </div>
            <p className="section__deck" style={{ marginTop: 0 }}>
              A página que você procurou não existe ou mudou de endereço. O cardápio do seu
              restaurante continua a um clique.
            </p>
            <div className="hero__actions">
              <Link className="btn" to="/">
                <Icon name="arrow-left" size={16} />
                Voltar ao início
              </Link>
              <Link className="btn btn--ghost" to="/entrar">
                Ir para a plataforma
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
