import { useParams, Link } from 'react-router-dom'
import AppShell from '@/components/AppShell'
import { Badge, Panel, StatCard } from '@/components/Ui'
import { getAuditDetail } from '@/api/audit'
import { useQuery } from '@tanstack/react-query'

const statusMap = {
  PENDING: { label: '待开始', tone: 'slate' },
  SCANNING: { label: '扫描中', tone: 'blue' },
  ANALYZING: { label: '分析中', tone: 'amber' },
  COMPLETED: { label: '已完成', tone: 'emerald' },
  FAILED: { label: '失败', tone: 'red' },
};

const formatDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

const AuditDetail = () => {
  const { id } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['auditDetail', id],
    queryFn: () => getAuditDetail(id),
    enabled: !!id,
  });

  const detail = data?.data

  if (isLoading) {
    return (
      <AppShell eyebrow="Audit Report" title="审计报告详情" description="">
        <div className="px-4 py-12 text-center text-sm text-slate-500">加载中...</div>
      </AppShell>
    )
  }

  if (!detail) {
    return (
      <AppShell eyebrow="Audit Report" title="审计报告详情" description="">
        <div className="px-4 py-12 text-center text-sm text-slate-500">未找到审计详情</div>
      </AppShell>
    )
  }

  const status = statusMap[detail.status] ?? { label: detail.status, tone: 'slate' }
  const scanProgress = detail.totalFiles
    ? Math.round((detail.scannedFiles / detail.totalFiles) * 100)
    : 0

  return (
    <AppShell
      eyebrow="Audit Report"
      title={detail.projectName ?? '审计报告详情'}
      description={`任务编号 ${detail.id} · ${status.label}`}
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="漏洞数量"
          value={detail.vulnCount ?? 0}
          trend={detail.vulnCount > 0 ? '需关注' : '安全'}
          tone={detail.vulnCount > 0 ? 'red' : 'emerald'}
        />
        <StatCard
          label="扫描进度"
          value={`${scanProgress}%`}
          trend={`${detail.scannedFiles ?? 0} / ${detail.totalFiles ?? 0} 文件`}
          tone="blue"
        />
        <StatCard
          label="创建时间"
          value={formatDate(detail.createdAt).split(' ')[0]}
          trend={formatDate(detail.createdAt).split(' ')[1] ?? ''}
          tone="violet"
        />
        <StatCard
          label="最近更新"
          value={formatDate(detail.updatedAt).split(' ')[0]}
          trend={formatDate(detail.updatedAt).split(' ')[1] ?? ''}
          tone="violet"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Panel title="任务详情" subtitle="审计任务的基本信息与配置">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">项目名称</p>
                <p className="mt-1 font-medium text-white">{detail.projectName ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">任务状态</p>
                <div className="mt-1">
                  <Badge tone={status.tone}>{status.label}</Badge>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">上传路径</p>
              <p className="mt-1 break-all font-mono text-sm text-slate-300">{detail.uploadPath ?? '-'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">文件扫描</p>
                <p className="mt-1 text-white">
                  {detail.scannedFiles ?? 0}
                  <span className="text-slate-500"> / {detail.totalFiles ?? 0}</span>
                </p>
                {detail.totalFiles > 0 && (
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">漏洞统计</p>
                <p className={`mt-1 text-lg font-bold ${(detail.vulnCount ?? 0) > 0 ? 'text-red-300' : 'text-emerald-300'}`}>
                  {detail.vulnCount ?? 0}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">创建时间</p>
                <p className="mt-1 text-sm text-slate-300">{formatDate(detail.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">更新时间</p>
                <p className="mt-1 text-sm text-slate-300">{formatDate(detail.updatedAt)}</p>
              </div>
            </div>

            {detail.errorMessage && (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-300">错误信息</p>
                <p className="mt-2 text-sm leading-6 text-red-200">{detail.errorMessage}</p>
              </div>
            )}
          </div>
        </Panel>

        <Panel title="快捷操作" subtitle="查看报告与漏洞详情">
          <div className="space-y-3">
            <Link
              to={`/audit/report-detail/${detail.id}/report`}
              className="flex min-h-12 items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-sm text-white transition hover:bg-white/10"
            >
              <span>查看审计报告</span>
              <svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </Link>
            <Link
              to={`/audit/report-detail/${detail.id}/vulnerabilities`}
              className="flex min-h-12 items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-sm text-white transition hover:bg-white/10"
            >
              <span>查看漏洞列表</span>
              <svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </Link>
            <Link
              to="/audit/tasks"
              className="flex min-h-12 items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-sm text-white transition hover:bg-white/10"
            >
              <span>返回任务列表</span>
              <svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </Link>
          </div>
        </Panel>
      </div>
    </AppShell>
  )
}

export default AuditDetail
