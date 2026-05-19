export const StatCard = ({ label, value, trend, tone = 'blue' }) => {
  const toneClassNames = {
    blue: 'from-blue-500/20 to-cyan-400/10 text-blue-200',
    red: 'from-red-500/20 to-orange-400/10 text-red-200',
    emerald: 'from-emerald-500/20 to-teal-400/10 text-emerald-200',
    violet: 'from-violet-500/20 to-fuchsia-400/10 text-violet-200',
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-slate-950/20 backdrop-blur">
      <div className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br px-3 py-1.5 text-xs font-semibold ${toneClassNames[tone]}`}>
        {trend}
      </div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-white">{value}</p>
    </section>
  )
}

export const Panel = ({ title, subtitle, children, className = '' }) => (
  <section className={`rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-slate-950/20 backdrop-blur ${className}`}>
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
    </div>
    {children}
  </section>
)

export const Badge = ({ children, tone = 'slate' }) => {
  const toneClassNames = {
    slate: 'bg-slate-400/10 text-slate-300 ring-slate-400/20',
    blue: 'bg-blue-400/10 text-blue-200 ring-blue-400/20',
    red: 'bg-red-400/10 text-red-200 ring-red-400/20',
    amber: 'bg-amber-400/10 text-amber-200 ring-amber-400/20',
    emerald: 'bg-emerald-400/10 text-emerald-200 ring-emerald-400/20',
  }

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneClassNames[tone]}`}>{children}</span>
}
