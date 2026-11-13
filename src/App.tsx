import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Building2, ChevronRight, Globe, Home, Mail, MapPin, Minimize2, Moon, Phone, Search, Settings, Sparkles, Sun, Users, X } from 'lucide-react'

type User = {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
  }
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}
type PageStyle = 'base' | 'elegante' | 'simples'

// Endpoint definido no desafio técnico. Os dados são carregados somente quando a aplicação inicia.
const USERS_ENDPOINT = 'https://jsonplaceholder.typicode.com/users'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [pageStyle, setPageStyle] = useState<PageStyle>('base')

  const loadUsers = async () => {
    setLoading(true)
    setError('')
    try {
      // A resposta é convertida para o tipo User para manter o contrato dos dados usado pelos componentes.
      const response = await fetch(USERS_ENDPOINT)
      if (!response.ok) {
        throw new Error('Não foi possível carregar os usuários.')
      }
      const data: User[] = await response.json()
      setUsers(data)
    } catch {
      setError('Não foi possível carregar os usuários. Verifique sua conexão e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [])

  // A busca é feita localmente depois do carregamento, sem novas requisições para a API.
  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase()
    if (!normalizedSearch) return users
    return users.filter((user) => user.name.toLocaleLowerCase().includes(normalizedSearch))
  }, [search, users])

  return (
    <div className={`app-shell ${theme === 'dark' ? 'dark-mode' : ''} page-style-${pageStyle}`} data-style={pageStyle}>
      <header className="topbar">
        <div className="topbar-content">
          <a className="brand" href="/" aria-label="Conecta - início">
            <span className="brand-mark"><Users size={19} strokeWidth={2.5} /></span>
            <span>conecta</span>
          </a>
          <div className="topbar-actions">
            <span className="topbar-label">Diretório de pessoas</span>
            <button className="settings-button" type="button" onClick={() => setSettingsOpen((isOpen) => !isOpen)} aria-label="Abrir configurações" aria-expanded={settingsOpen}>
              <Settings size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="page-content">
        <section className="hero">
          <div>
            <p className="eyebrow">Diretório de usuários</p>
            <h1>Encontre quem você procura.</h1>
            <p className="hero-description">Consulte informações de contato e conheça melhor cada pessoa da sua rede.</p>
          </div>
          <div className="hero-count" aria-label={`${users.length} usuários cadastrados`}>
            <strong>{users.length || '—'}</strong>
            <span>usuários<br />cadastrados</span>
          </div>
        </section>

        <section className="directory" aria-labelledby="directory-title">
          <div className="directory-heading">
            <div>
              <h2 id="directory-title">Todos os usuários</h2>
              <p>{filteredUsers.length} {filteredUsers.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}</p>
            </div>
            <label className="search-field">
              <Search size={19} aria-hidden="true" />
              <span className="sr-only">Buscar usuário pelo nome</span>
              <input
                type="search"
                placeholder="Buscar por nome..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {search && <button type="button" className="clear-search" onClick={() => setSearch('')} aria-label="Limpar busca"><X size={16} /></button>}
            </label>
          </div>

          {loading && <LoadingState />}
          {!loading && error && <ErrorState message={error} onRetry={() => void loadUsers()} />}
          {!loading && !error && filteredUsers.length === 0 && <EmptyState search={search} />}
          {!loading && !error && filteredUsers.length > 0 && (
            <div className="user-grid">
              {filteredUsers.map((user) => <UserCard key={user.id} user={user} onSelect={setSelectedUser} />)}
            </div>
          )}
        </section>
      </main>

      {/* As configurações são um modal para preservar a página principal enquanto o usuário escolhe os temas. */}
      {settingsOpen && <SettingsModal theme={theme} onThemeChange={setTheme} pageStyle={pageStyle} onStyleChange={setPageStyle} onClose={() => setSettingsOpen(false)} />}
      {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  )
}

function SettingsModal({ theme, onThemeChange, pageStyle, onStyleChange, onClose }: { theme: 'light' | 'dark'; onThemeChange: (theme: 'light' | 'dark') => void; pageStyle: PageStyle; onStyleChange: (style: PageStyle) => void; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-modal-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Fechar configurações"><X size={21} /></button>
        <div className="settings-modal-heading">
          <p className="eyebrow">Preferências</p>
          <h2 id="settings-modal-title">Configurações</h2>
          <p>Escolha o modo de visualização do diretório.</p>
        </div>
        <div className="theme-options">
          <button className={`theme-option ${theme === 'light' ? 'selected' : ''}`} type="button" onClick={() => onThemeChange('light')}>
            <span className="theme-option-icon"><Sun size={19} /></span>
            <span className="theme-option-copy"><strong>Modo claro</strong><small>Tema claro padrão</small></span>
            <span className="theme-radio" aria-hidden="true" />
          </button>
          <button className={`theme-option ${theme === 'dark' ? 'selected' : ''}`} type="button" onClick={() => onThemeChange('dark')}>
            <span className="theme-option-icon"><Moon size={19} /></span>
            <span className="theme-option-copy"><strong>Modo escuro</strong><small>Confortável para ambientes escuros</small></span>
            <span className="theme-radio" aria-hidden="true" />
          </button>
        </div>
        <div className="settings-section-bar">Estilo</div>
        <div className="style-options">
          <StyleOption icon={<Sun size={18} />} name="Base" description="Visual padrão" selected={pageStyle === 'base'} onClick={() => onStyleChange('base')} />
          <StyleOption icon={<Sparkles size={18} />} name="Elegante" description="Mais sofisticado" selected={pageStyle === 'elegante'} onClick={() => onStyleChange('elegante')} />
          <StyleOption icon={<Minimize2 size={18} />} name="Simples" description="Mais leve" selected={pageStyle === 'simples'} onClick={() => onStyleChange('simples')} />
        </div>
      </section>
    </div>
  )
}

function StyleOption({ icon, name, description, selected, onClick }: { icon: React.ReactNode; name: string; description: string; selected: boolean; onClick: () => void }) {
  return (
    <button className={`style-option ${selected ? 'selected' : ''}`} type="button" onClick={onClick}>
      <span className="style-option-icon">{icon}</span>
      <span><strong>{name}</strong><small>{description}</small></span>
      <span className="theme-radio" aria-hidden="true" />
    </button>
  )
}

function UserCard({ user, onSelect }: { user: User; onSelect: (user: User) => void }) {
  const initials = user.name.split(' ').map((part) => part[0]).slice(0, 2).join('')
  return (
    <button className={`user-card avatar-card-${((user.id - 1) % 10) + 1}`} type="button" onClick={() => onSelect(user)}>
      <span className={`avatar avatar-${((user.id - 1) % 10) + 1}`}>{initials}</span>
      <span className="user-card-body">
        <strong>{user.name}</strong>
        <span className="username">@{user.username}</span>
        <span className="card-email"><Mail size={15} />{user.email}</span>
      </span>
      <ChevronRight className="card-arrow" size={20} aria-hidden="true" />
    </button>
  )
}

function UserModal({ user, onClose }: { user: User; onClose: () => void }) {
  useEffect(() => {
    // Impede a rolagem da página ao fundo e permite fechar o modal com a tecla Escape.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`modal avatar-card-${((user.id - 1) % 10) + 1}`} role="dialog" aria-modal="true" aria-labelledby="user-modal-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Fechar detalhes"><X size={21} /></button>
        <div className="modal-header">
          <span className={`avatar avatar-large avatar-${((user.id - 1) % 10) + 1}`}>{user.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
          <div><p className="eyebrow">Detalhes do usuário</p><h2 id="user-modal-title">{user.name}</h2><span className="username">@{user.username}</span></div>
        </div>
        <div className={`detail-list avatar-card-${((user.id - 1) % 10) + 1}`}>
          <Detail icon={<Mail />} label="Email" value={user.email} />
          <Detail icon={<Phone />} label="Telefone" value={user.phone} />
          <Detail icon={<Globe />} label="Website" value={user.website} />
          <Detail icon={<Building2 />} label="Empresa" value={user.company.name} />
          <Detail icon={<MapPin />} label="Cidade" value={user.address.city} />
          <Detail icon={<Home />} label="Endereço" value={`${user.address.street}, ${user.address.suite}`} />
          <Detail icon={<MapPin />} label="CEP" value={user.address.zipcode} />
        </div>
        <div className="company-note">
          <strong>Sobre a empresa</strong>
          <p>“{user.company.catchPhrase}”</p>
          <small>{user.company.bs}</small>
        </div>
      </section>
    </div>
  )
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="detail-row"><span className="detail-icon">{icon}</span><span><small>{label}</small><strong>{value}</strong></span></div>
}

function LoadingState() {
  return <div className="state-box"><div className="spinner" /><strong>Carregando usuários</strong><p>Buscando os dados mais recentes...</p></div>
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div className="state-box"><AlertCircle className="state-icon error-icon" /><strong>Algo deu errado</strong><p>{message}</p><button className="retry-button" type="button" onClick={onRetry}>Tentar novamente</button></div>
}

function EmptyState({ search }: { search: string }) {
  return <div className="state-box"><Search className="state-icon" /><strong>Nenhum usuário encontrado</strong><p>Não encontramos resultados para “{search}”. Tente buscar por outro nome.</p></div>
}

export default App
