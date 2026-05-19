import { NavLink } from 'react-router-dom'

const navigationSections = [
  {
    title: '安全审计',
    links: [
      { label: '态势总览', path: '/', icon: 'overview' },
      { label: '审计任务', path: '/audit/tasks', icon: 'tasks' },
      { label: '上传样本', path: '/audit/upload', icon: 'upload' },
    ],
  },
  {
    title: '知识库',
    links: [
      { label: '智能检索', path: '/knowledge/search', icon: 'search' },
      { label: '知识库管理', path: '/knowledge/manage', icon: 'database' },
    ],
  },
]

const Icon = ({ name }) => {
  const paths = {
    overview: 'M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-5H4v5Z',
    tasks: 'M5 5h14v3H5V5Zm0 6h14v3H5v-3Zm0 6h9v3H5v-3Z',
    upload: 'M12 3 6 9h4v6h4V9h4l-6-6ZM5 19h14v2H5v-2Z',
    search: 'm18.8 20.2-5.2-5.2a6 6 0 1 1 1.4-1.4l5.2 5.2-1.4 1.4ZM10 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
    database: 'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3Zm-8 6c1.5 1.3 4.5 2 8 2s6.5-.7 8-2v3c0 1.7-3.6 3-8 3s-8-1.3-8-3V9Zm0 6c1.5 1.3 4.5 2 8 2s6.5-.7 8-2v3c0 1.7-3.6 3-8 3s-8-1.3-8-3v-3Z',
  }

  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d={paths[name]} />
    </svg>
  )
}

const AppShell = ({ children, eyebrow, title, description, actions }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.35),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.2),_transparent_26%),linear-gradient(135deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]" />
      <a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-blue-500 focus:px-4 focus:py-3 focus:text-white" href="#main-content">
        跳转到主要内容
      </a>

      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl lg:block">
        <div className="flex items-center gap-3 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500 text-lg font-black shadow-lg shadow-blue-500/30">
            AI
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Sentinel KB</p>
            <p className="text-xs text-slate-400">AI 安全审计中枢</p>
          </div>
        </div>

        <nav className="mt-8 space-y-8" aria-label="主导航">
          {navigationSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{section.title}</p>
              <div className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      [
                        'group flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition',
                        isActive
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                          : 'text-slate-400 hover:bg-white/10 hover:text-white',
                      ].join(' ')
                    }
                  >
                    <Icon name={link.icon} />
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4">
          <p className="text-sm font-semibold text-emerald-200">合规引擎在线</p>
          <p className="mt-2 text-xs leading-5 text-emerald-100/70">覆盖 OWASP、CWE、MITRE ATT&CK 与企业内控知识。</p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-300">{eyebrow}</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{description}</p>
            </div>
          </div>
        </header>

        <main id="main-content" className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppShell
