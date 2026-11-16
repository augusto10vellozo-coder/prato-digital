import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import { decodeSiteFromLocation } from '../lib/share'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { SiteView } from '../components/SiteView'
import { Icon } from '../components/Icon'

export function PublicSite() {
  const { slug = '' } = useParams()
  const { siteBySlug, menuById } = useStore()
  const shared = useMemo(() => decodeSiteFromLocation(), [])
  const site = shared ?? siteBySlug(slug)
  const menu = site?.menuId ? menuById(site.menuId) : undefined

  useDocumentTitle(site ? `${site.name} — site` : 'Site não encontrado')

  if (!site) {
    return (
      <main className="sitev" id="conteudo" style={{ display: 'grid', placeItems: 'center', padding: 40 }}>
        <div style={{ maxWidth: 520, textAlign: 'center' }}>
          <h1 style={{ fontSize: 42 }}>Site não encontrado.</h1>
          <p style={{ margin: '12px 0 20px', opacity: 0.7 }}>
            O link pode ter mudado ou a prévia foi removida.
          </p>
          <Link className="sitev__btn sitev__btn--solid" to="/">
            Voltar ao site
            <Icon name="arrow-left" size={15} />
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main id="conteudo">
      <SiteView site={site} menu={menu} />
    </main>
  )
}
