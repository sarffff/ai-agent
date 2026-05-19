import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { login } from '@/api/login'
import { useAuth } from '@/store/AuthContext'
import message from '@/components/Message'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { saveToken } = useAuth()

  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const from = location.state?.from?.pathname || '/'

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.username.trim()) {
      setError('请输入用户名')
      return
    }
    if (!form.password.trim()) {
      setError('请输入密码')
      return
    }

    setLoading(true)
    try {
      const res = await login({ username: form.username, password: form.password })
      const token = res?.token || res?.data?.token || res
      if (typeof token === 'string') {
        saveToken(token)
      } else {
        saveToken('authenticated')
      }
      message.success('登录成功，正在跳转...')
      navigate(from, { replace: true })
    } catch (err) {
      const errMsg = err.message || '登录失败，请检查账号密码'
      setError(errMsg)
      message.error(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.35),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.2),_transparent_26%),linear-gradient(135deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]" />

      {/* Decorative grid dots */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, rgba(148,163,184,1) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500 text-2xl font-black text-white shadow-2xl shadow-blue-500/40">
            AI
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-white">
            Sentinel KB
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            AI 安全审计中枢
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">登录</h2>
            <p className="mt-1 text-sm text-slate-400">输入您的账号以访问安全审计平台</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200" role="alert">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Username */}
            <div>
              <label htmlFor="login-username" className="mb-2 block text-sm font-medium text-slate-300">
                用户名
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg className="h-5 w-5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <input
                  id="login-username"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  value={form.username}
                  onChange={handleChange('username')}
                  placeholder="请输入用户名"
                  className="min-h-[48px] w-full rounded-2xl border border-white/10 bg-slate-950/60 py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-slate-300">
                密码
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg className="h-5 w-5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder="请输入密码"
                  className="min-h-[48px] w-full rounded-2xl border border-white/10 bg-slate-950/60 py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer accent-blue-500"
                />
                记住我
              </label>
              <button type="button" className="cursor-pointer text-sm text-blue-400 transition hover:text-blue-300">
                忘记密码?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  登录中...
                </>
              ) : '登 录'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-600">
          Sentinel KB v1.0 &middot; AI 安全审计中枢
        </p>
      </div>
    </div>
  )
}

export default Login
