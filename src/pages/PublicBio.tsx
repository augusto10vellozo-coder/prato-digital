import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { BioCard } from '../components/BioCard'
import { SITE } from '../config'

export function PublicBio() {
  useDocumentTitle(`${SITE.name} — link na bio`)
  const { data, menus } = useStore()

  return (
    <main className="bio-page" id="conteudo">
      <div>
        <BioCard profile={data.settings.bio} menus={menus} />
        <div className="bio-page__foot">
          Feito com{' '}
          <Link to="/" style={{ fontWeight: 700 }}>
            {SITE.name}
          </Link>
        </div>
      </div>
    </main>
  )
}
