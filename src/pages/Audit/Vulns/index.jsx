import { useParams, Link } from 'react-router-dom'
import AppShell from '@/components/AppShell'
import { Badge, Panel, StatCard } from '@/components/Ui'
import { getVulnerabilityList, getVulnerabilityStatistics } from '@/api/audit'
import { useQuery } from '@tanstack/react-query'

const riskTone = {
  严重: 'red',
  高危: 'red',
  中危: 'amber',
  低危: 'blue',
  信息: 'slate',
}

const formatDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

const Vulns = () => {
  const { id } = useParams()

  const { data, isLoading: vulnsLoading } = useQuery({
    queryKey: ['vulnerabilityList', id],
    queryFn: () => getVulnerabilityList(id),
    enabled: !!id,
  })

  const vulns = data?.data ?? []

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['vulnerabilityStatistics', id],
    queryFn: () => getVulnerabilityStatistics(id),
    enabled: !!id,
  })

  const stats = statsData?.data ?? {}

  const isLoading = vulnsLoading || statsLoading

  if (isLoading) {
    return (
      <AppShell eyebrow="Vulnerabilities" title="漏洞列表" description="">
        <div className="px-4 py-12 text-center text-sm text-slate-500">加载中...</div>
      </AppShell>
    )
  }

  const list = vulns ?? []

  const statCards = [
    { label: '总漏洞数', value: stats?.totalVulns ?? list.length ?? 0, tone: 'red' },
    { label: '严重', value: stats?.criticalCount ?? 0, tone: 'red' },
    { label: '高危', value: stats?.highCount ?? 0, tone: 'red' },
    { label: '中危', value: stats?.mediumCount ?? 0, tone: 'amber' },
    { label: '低危', value: stats?.lowCount ?? stats?.infoCount ?? 0, tone: 'blue' },
  ]

  const distribution = stats?.vulnTypeDistribution ?? {}
  const distEntries = Object.entries(distribution).sort((a, b) => b[1] - a[1])
  const distMax = distEntries.length > 0 ? Math.max(...distEntries.map(([, v]) => v)) : 1

  return (
    <AppShell
      eyebrow="Vulnerabilities"
      title="漏洞列表"
      description={`任务编号 ${id}`}
    >
      <div className="mb-4">
        <Link
          to={`/audit/report-detail/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          返回任务详情
        </Link>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} tone={s.tone} />
        ))}
      </div>

      {distEntries.length > 0 && (
        <Panel title="漏洞类型分布" className="mb-6">
          <div className="space-y-3">
            {distEntries.map(([type, count]) => (
              <div key={type} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-sm text-slate-300">{type}</span>
                <div className="flex-1">
                  <div className="h-5 overflow-hidden rounded-lg bg-slate-800">
                    <div
                      className="flex h-full items-center justify-end rounded-lg bg-gradient-to-r from-blue-500/60 to-violet-500/60 pr-2 transition-all"
                      style={{ width: `${Math.max((count / distMax) * 100, 8)}%` }}
                    >
                      <span className="text-xs font-semibold text-white">{count}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <Panel title="漏洞详情" subtitle={`共 ${list.length} 项`}>
        {list.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">未发现漏洞</div>
        ) : (
          <div className="space-y-4">
            {list.map((vuln, index) => (
              <article
                key={vuln.taskId ?? index}
                className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 transition hover:bg-white/[0.02]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">{vuln.title ?? `漏洞 #${index + 1}`}</h3>
                      {vuln.riskLevel && (
                        <Badge tone={riskTone[vuln.riskLevel] ?? 'amber'}>{vuln.riskLevel}</Badge>
                      )}
                      {vuln.vulnType && (
                        <span className="rounded-lg bg-violet-500/10 px-2 py-0.5 text-xs font-semibold text-violet-300 ring-1 ring-violet-400/20">
                          {vuln.vulnType}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 font-mono text-xs text-slate-500">
                      {vuln.filePath ?? '-'}{vuln.lineNumber ? `:${vuln.lineNumber}` : ''}
                    </p>
                  </div>
                  {vuln.confidence != null && (
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-slate-500">置信度</p>
                      <p className={`mt-0.5 text-sm font-bold ${vuln.confidence >= 80 ? 'text-emerald-300' : vuln.confidence >= 50 ? 'text-amber-300' : 'text-slate-400'}`}>
                        {vuln.confidence}%
                      </p>
                    </div>
                  )}
                </div>

                {vuln.description && (
                  <p className="mt-3 text-sm leading-6 text-slate-400">{vuln.description}</p>
                )}

                {vuln.codeSnippet && (
                  <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-900/60 p-3 font-mono text-xs leading-5 text-slate-300">
                    {vuln.codeSnippet}
                  </pre>
                )}

                {vuln.aiAnalysis && (
                  <div className="mt-3 rounded-xl border border-blue-400/20 bg-blue-400/5 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">AI 分析</p>
                    <p className="mt-1 text-sm leading-6 text-blue-100/70">{vuln.aiAnalysis}</p>
                  </div>
                )}

                {vuln.suggestion && (
                  <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">修复建议</p>
                    <p className="mt-1 text-sm text-emerald-100/70">{vuln.suggestion}</p>
                  </div>
                )}

                <div className="mt-3 flex items-center gap-4 text-xs text-slate-600">
                  {vuln.createdAt && <span>发现于 {formatDate(vuln.createdAt)}</span>}
                </div>
              </article>
            ))}
          </div>
        )}
      </Panel>
    </AppShell>
  )
}

export default Vulns
