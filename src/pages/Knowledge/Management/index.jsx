import { useState } from 'react'
import AppShell from '@/components/AppShell'
import { Badge, Panel } from '@/components/Ui'
import { searchKnowledge, addKnowledge, deleteKnowledge, getAllVulType, getAllCategory } from '@/api/knowledge'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import message from '@/components/Message'

const typeTone = {
  '漏洞模式': 'red',
  '合规规则': 'blue',
  '修复案例': 'emerald',
}

const formatDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

const KnowledgeManagement = () => {
  const queryClient = useQueryClient()
  const [keyword, setKeyword] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [searchCategory, setSearchCategory] = useState('')
  const [searchVulnType, setSearchVulnType] = useState('')

  const [form, setForm] = useState({ title: '', content: '', source: '', category: '', vulnType: '' })

  const searchParams = {
    keyword,
    ...(searchCategory ? { category: searchCategory } : {}),
    ...(searchVulnType ? { vulnType: searchVulnType } : {}),
  }

  const { data: knowledgeList, isLoading } = useQuery({
    queryKey: ['knowledgeList', searchParams],
    queryFn: () => searchKnowledge(searchParams),
  })

  const { data: categories } = useQuery({
    queryKey: ['knowledgeCategories'],
    queryFn: getAllCategory,
  })

  const { data: vulTypes } = useQuery({
    queryKey: ['knowledgeVulTypes'],
    queryFn: getAllVulType,
  })

  const addMutation = useMutation({
    mutationFn: (data) => addKnowledge(data),
    onSuccess: () => {
      message.success('添加成功')
      setForm({ title: '', content: '', source: '', category: '', vulnType: '' })
      queryClient.invalidateQueries({ queryKey: ['knowledgeList'] })
    },
    onError: () => {
      message.error('添加失败，请重试')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteKnowledge(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['knowledgeList'] })
    },
    onError: () => {
      message.error('删除失败')
    },
  })

  const list = knowledgeList?.records ?? knowledgeList?.data ?? knowledgeList ?? []

  const handleSearch = (e) => {
    e.preventDefault()
    setKeyword(searchInput)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) {
      message.error('请填写标题和内容')
      return
    }
    addMutation.mutate(form)
  }

  const handleDelete = (id) => {
    if (window.confirm('确定要删除此知识条目吗？')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <AppShell
      eyebrow="Knowledge Operations"
      title="知识库管理"
      description="管理安全规则、漏洞知识、修复案例与企业合规基线，持续提升 AI 审计准确率。"
    >
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel title="添加知识条目" subtitle="录入新的安全知识或修复案例">
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">分类</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="min-h-11 w-full cursor-pointer appearance-none rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-sm text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                >
                  <option value="" className="bg-slate-900">请选择分类</option>
                  {(categories?.data ?? categories ?? []).map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">漏洞类型</label>
                <select
                  value={form.vulnType}
                  onChange={(e) => setForm({ ...form, vulnType: e.target.value })}
                  className="min-h-11 w-full cursor-pointer appearance-none rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-sm text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                >
                  <option value="" className="bg-slate-900">请选择漏洞类型</option>
                  {(vulTypes?.data ?? vulTypes ?? []).map((vt) => (
                    <option key={vt} value={vt} className="bg-slate-900">{vt}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">标题</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="输入知识条目标题"
                className="min-h-11 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-sm text-slate-200 placeholder-slate-600 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">内容</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="输入知识条目详细内容"
                rows={6}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">来源</label>
              <input
                type="text"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                placeholder="输入知识条目来源"
                className="min-h-11 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-sm text-slate-200 placeholder-slate-600 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
              />
            </div>
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="min-h-11 w-full cursor-pointer rounded-2xl bg-blue-500 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addMutation.isPending ? '提交中...' : '添加条目'}
            </button>
          </form>
        </Panel>

        <Panel title="知识库条目" subtitle={`共 ${list.length} 条`}>
          <form onSubmit={handleSearch} className="mb-4 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="搜索知识条目..."
                className="min-h-11 flex-1 rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-sm text-slate-200 placeholder-slate-600 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
              />
              <button
                type="submit"
                className="min-h-11 cursor-pointer rounded-2xl border border-white/10 bg-slate-950/40 px-5 text-sm text-slate-300 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
              >
                搜索
              </button>
            </div>
            <div className="flex gap-2">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="min-h-11 flex-1 cursor-pointer appearance-none rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-sm text-slate-300 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
              >
                <option value="" className="bg-slate-900">全部分类</option>
                {(categories?.data ?? categories ?? []).map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                ))}
              </select>
              <select
                value={searchVulnType}
                onChange={(e) => setSearchVulnType(e.target.value)}
                className="min-h-11 flex-1 cursor-pointer appearance-none rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-sm text-slate-300 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
              >
                <option value="" className="bg-slate-900">全部漏洞类型</option>
                {(vulTypes?.data ?? vulTypes ?? []).map((vt) => (
                  <option key={vt} value={vt} className="bg-slate-900">{vt}</option>
                ))}
              </select>
              {(keyword || searchCategory || searchVulnType) && (
                <button
                  type="button"
                  onClick={() => { setKeyword(''); setSearchInput(''); setSearchCategory(''); setSearchVulnType('') }}
                  className="min-h-11 shrink-0 cursor-pointer rounded-2xl border border-white/10 bg-slate-950/40 px-5 text-sm text-slate-300 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                >
                  清除
                </button>
              )}
            </div>
          </form>

          {isLoading && (
            <div className="py-12 text-center text-sm text-slate-500">加载中...</div>
          )}

          {!isLoading && list.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-500">
              {keyword ? '未找到匹配的知识条目' : '暂无知识条目'}
            </div>
          )}

          {!isLoading && list.length > 0 && (
            <div className="space-y-3">
              {list.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 transition hover:bg-white/[0.02]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-white">{item.title}</h3>
                        {item.category && <Badge tone={typeTone[item.category] ?? 'slate'}>{item.category}</Badge>}
                        {item.vulnType && (
                          <span className="rounded-lg bg-violet-500/10 px-2 py-0.5 text-xs font-semibold text-violet-300 ring-1 ring-violet-400/20">
                            {item.vulnType}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-3">{item.content}</p>
                      {item.source && (
                        <p className="mt-2 text-xs text-slate-600">来源: {item.source}</p>
                      )}
                      {item.createdAt && (
                        <p className="mt-2 text-xs text-slate-600">{formatDate(item.createdAt)}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="删除"
                      className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-400/30"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </AppShell>
  )
}

export default KnowledgeManagement
