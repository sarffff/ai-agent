import AppShell from '@/components/AppShell'
import { Panel } from '@/components/Ui'
import { startAudit } from '@/api/audit'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import message from '@/components/Message'

const MAX_SIZE = 100 * 1024 * 1024 // 100MB

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const AuditUpload = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [projectName, setProjectName] = useState('')

  const mutation = useMutation({
    mutationFn: (data) => startAudit(projectName, data),
    onSuccess: (res) => {
      message.success('审计任务已启动')
      const taskId = res?.data?.id ?? res?.data
      if (taskId) {
        navigate(`/audit/report-detail/${taskId}`)
      } else {
        navigate('/audit/tasks')
      }
    },
    onError: () => {
      message.error('启动审计失败，请重试')
    },
  })

  const validateFile = (f) => {
    if (!f) return '请选择文件'
    if (!f.name.endsWith('.zip')) return '仅支持 ZIP 格式的压缩包'
    if (f.size > MAX_SIZE) return `文件大小超过 100MB 限制（当前 ${formatSize(f.size)}）`
    return null
  }

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const err = validateFile(f)
    if (err) {
      message.error(err)
      e.target.value = ''
      return
    }
    setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (!f) return
    const err = validateFile(f)
    if (err) {
      message.error(err)
      return
    }
    setFile(f)
  }

  const handleSubmit = () => {
    if (!projectName.trim()) {
      message.error('请输入项目名称')
      return
    }
    if (!file) {
      message.error('请先选择 ZIP 压缩包')
      return
    }
    const formData = new FormData()
    formData.append('file', file)
    mutation.mutate(formData )

  }

  const handleRemoveFile = () => {
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <AppShell
      eyebrow="Sample Intake"
      title="上传审计样本"
      description="上传 ZIP 格式的代码压缩包，自动触发 AI 审计流水线。"
    >
      <div className="mx-auto max-w-2xl">
        <Panel title="样本上传" subtitle="支持 ZIP 格式，最大 100MB">
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">项目名称</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="输入项目名称"
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-sm text-slate-200 placeholder-slate-600 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            />
          </div>
          {!file ? (
            <label
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex min-h-80 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed p-8 text-center transition focus-within:ring-4 focus-within:ring-blue-500/30 ${
                dragOver
                  ? 'border-blue-400/60 bg-blue-500/10'
                  : 'border-blue-300/40 bg-blue-500/5 hover:bg-blue-500/10'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                className="sr-only"
                onChange={handleFileChange}
              />
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20 text-2xl font-bold text-blue-200">↑</span>
              <span className="mt-5 text-lg font-semibold text-white">拖拽 ZIP 文件到此处，或点击选择</span>
              <span className="mt-2 max-w-md text-sm leading-6 text-slate-400">仅支持 .zip 格式，文件大小不超过 100MB。</span>
            </label>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-sm font-bold text-blue-200">ZIP</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{file.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatSize(file.size)}</p>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  移除
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={mutation.isPending}
                className="min-h-12 w-full cursor-pointer rounded-2xl bg-blue-500 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {mutation.isPending ? '正在提交...' : '启动 AI 审计'}
              </button>
            </div>
          )}
        </Panel>
      </div>
    </AppShell>
  )
}

export default AuditUpload
