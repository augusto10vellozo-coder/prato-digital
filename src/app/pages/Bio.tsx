import { Link } from 'react-router-dom'
import { SITE } from '../../config'
import { useStore } from '../../lib/store'
import { usePlan } from '../../lib/usePlan'
import { BioCard } from '../../components/BioCard'
import { Icon } from '../../components/Icon'
import { PageHead, UpgradeGate } from '../ui'

export function AppBio() {
  const plan = usePlan()
  const { data, menus, session, updateBio, notify } = useStore()
  const bio = data.settings.bio

  if (!plan.allows('pro')) {
    return (
      <div className="app-page">
        <PageHead title="Link na bio" subtitle="Uma página de links para colocar no Instagram." />
        <UpgradeGate
          feature="Link na bio"
          required="pro"
          description="Publique uma página com seus cardápios e um botão de WhatsApp para usar na bio do Instagram. Inclusa no plano Pro."
        />
      </div>
    )
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, '')}/bio`,
      )
      notify('Link da bio copiado.')
    } catch {
      notify('Não foi possível copiar o link.')
    }
  }

  return (
    <div className="app-page">
      <PageHead
        title="Link na bio"
        subtitle="Uma página simples com sua marca, seus cardápios e um botão de WhatsApp."
        actions={
          <>
            <Link className="btn btn--ghost btn--sm" to="/bio" target="_blank">
              <Icon name="eye" size={15} />
              Ver prévia
            </Link>
            <button type="button" className="btn btn--red btn--sm" onClick={copyLink}>
              <Icon name="copy" size={15} />
              Copiar link
            </button>
          </>
        }
      />

      <div className="app-bio-grid">
        <section className="app-tool">
          <h2>Seus dados</h2>
          <p>O que aparece na página pública. O link usa os cardápios salvos neste navegador.</p>

          <div className="form-grid" style={{ marginTop: 12 }}>
            <div className="field span-2">
              <label htmlFor="bio-name">Nome de exibição</label>
              <input
                id="bio-name"
                className="input"
                value={bio.name}
                onChange={(event) => updateBio({ name: event.target.value })}
                placeholder={session?.name ?? SITE.owner.name}
              />
            </div>
            <div className="field span-2">
              <label htmlFor="bio-headline">Frase</label>
              <input
                id="bio-headline"
                className="input"
                value={bio.headline}
                onChange={(event) => updateBio({ headline: event.target.value })}
                placeholder="Cardápios online para restaurantes de bairro"
              />
            </div>
            <div className="field span-2">
              <label htmlFor="bio-whatsapp">WhatsApp</label>
              <input
                id="bio-whatsapp"
                className="input"
                inputMode="tel"
                value={bio.whatsapp}
                onChange={(event) => updateBio({ whatsapp: event.target.value })}
                placeholder="(41) 99999-9999"
              />
            </div>
          </div>

          <p className="app-note" style={{ marginTop: 12 }}>
            Nesta v1 o link é uma prévia local: os cardápios vivem no navegador onde foram
            criados. Em produção, a página precisa ser publicada com os dados no servidor.
          </p>
        </section>

        <aside>
          <BioCard profile={bio} menus={menus} />
          <p className="app-note" style={{ textAlign: 'center', marginTop: 10 }}>
            Prévia do link /bio
          </p>
        </aside>
      </div>
    </div>
  )
}
