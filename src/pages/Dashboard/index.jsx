import AppShell from '@/components/AppShell'
import { Badge, Panel, StatCard } from '@/components/Ui'

const auditStages = [
  { label: '样本接入', value: '1,284', width: '92%' },
  { label: 'AI 规则匹配', value: '1,108', width: '79%' },
  { label: '人工复核', value: '326', width: '34%' },
  { label: '知识沉淀', value: '214', width: '26%' },
]

const risks = [
  { name: '身份鉴权绕过', level: '高危', count: 18, tone: 'red' },
  { name: '敏感信息泄露', level: '中危', count: 42, tone: 'amber' },
  { name: '依赖组件漏洞', level: '高危', count: 27, tone: 'red' },
  { name: '弱配置基线', level: '低危', count: 63, tone: 'blue' },
]

const Dashboard = () => {
  return (
    <AppShell
      eyebrow="Security Intelligence Dashboard"
      title="AI 驱动的自动化安全审计与知识库管理系统"
      description="统一接入代码、配置、文档与运行日志，结合 AI 规则推理、漏洞知识图谱和审计报告生成，形成可追踪的安全闭环。"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="今日审计任务" value="128" trend="+18% vs 昨日" tone="blue" />
        <StatCard label="待复核高危项" value="37" trend="需优先处理" tone="red" />
        <StatCard label="知识命中率" value="91.6%" trend="+6.2% 本周" tone="emerald" />
        <StatCard label="平均处置时长" value="2.4h" trend="-34min" tone="violet" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="自动化审计流水线" subtitle="从样本上传到知识沉淀的实时处理状态">
          <div className="space-y-5">
            {auditStages.map((stage) => (
              <div key={stage.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-200">{stage.label}</span>
                  <span className="font-mono text-blue-200">{stage.value}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-800">
                  <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-300" style={{ width: stage.width }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="风险雷达" subtitle="按漏洞类型聚合的审计发现">
          <div className="space-y-3">
            {risks.map((risk) => (
              <div key={risk.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div>
                  <p className="font-medium text-white">{risk.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{risk.count} 个相关发现</p>
                </div>
                <Badge tone={risk.tone}>{risk.level}</Badge>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="AI Agent 编排" subtitle="多代理协同执行安全审计">
          <div className="space-y-4">
            {['代码语义分析 Agent', '漏洞模式匹配 Agent', '报告生成 Agent'].map((agent, index) => (
              <div key={agent} className="rounded-2xl bg-white/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 font-mono text-sm text-blue-200">
                    0{index + 1}
                  </span>
                  <p className="font-medium text-white">{agent}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="知识库覆盖" subtitle="安全知识资产健康度">
          <div className="grid grid-cols-2 gap-3">
            {['CWE', 'OWASP', 'ATT&CK', '内控基线'].map((source) => (
              <div key={source} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-sm text-slate-400">{source}</p>
                <p className="mt-3 text-2xl font-bold text-white">98%</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="系统状态" subtitle="关键服务可用性">
          <div className="space-y-3">
            {['向量检索', '规则引擎', '报告队列', '审计沙箱'].map((service) => (
              <div key={service} className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{service}</span>
                <Badge tone="emerald">在线</Badge>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  )
}

export default Dashboard
