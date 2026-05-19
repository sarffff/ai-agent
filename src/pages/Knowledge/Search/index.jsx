import AppShell from '../../../components/AppShell'
import { Badge, Panel } from '../../../components/Ui'

const results = [
  { title: 'CWE-287 身份认证不当', type: '漏洞模式', score: '98%' },
  { title: 'OWASP API2: Broken Authentication', type: '合规条目', score: '94%' },
  { title: 'JWT 安全配置最佳实践', type: '修复指南', score: '91%' },
]

const KnowledgeSearch = () => {
  return (
    <AppShell
      eyebrow="Knowledge Retrieval"
      title="智能知识库检索"
      description="通过自然语言、漏洞证据或代码片段进行向量检索，召回可解释的安全知识与修复经验。"
    >
      <Panel title="语义检索" subtitle="输入漏洞现象、报错日志或审计上下文">
        <div className="flex flex-col gap-3 md:flex-row">
          <input className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20" placeholder="例如：JWT token 未校验签名导致越权访问" />
          <button className="min-h-12 cursor-pointer rounded-2xl bg-blue-500 px-6 font-semibold text-white transition hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/40">
            检索知识
          </button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {results.map((result) => (
            <article key={result.title} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="flex items-center justify-between">
                <Badge tone="blue">{result.type}</Badge>
                <span className="font-mono text-sm text-emerald-200">{result.score}</span>
              </div>
              <h3 className="mt-4 font-semibold text-white">{result.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">包含触发条件、检测逻辑、误报排除与可执行修复建议。</p>
            </article>
          ))}
        </div>
      </Panel>
    </AppShell>
  )
}

export default KnowledgeSearch
