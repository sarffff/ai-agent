import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import message from './store'

const toneConfig = {
  success: {
    border: 'border-emerald-400/20',
    bg: 'bg-emerald-400/10',
    iconColor: 'text-emerald-400',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    ),
  },
  error: {
    border: 'border-red-400/20',
    bg: 'bg-red-400/10',
    iconColor: 'text-red-400',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </>
    ),
  },
  warning: {
    border: 'border-amber-400/20',
    bg: 'bg-amber-400/10',
    iconColor: 'text-amber-400',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </>
    ),
  },
  info: {
    border: 'border-blue-400/20',
    bg: 'bg-blue-400/10',
    iconColor: 'text-blue-400',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </>
    ),
  },
}

const MessageItem = ({ msg, onClose }) => {
  const tone = toneConfig[msg.type] || toneConfig.info

  return (
    <div
      className={`msg-${msg.closing ? 'exit' : 'enter'} pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border ${tone.border} ${tone.bg} px-4 py-3 shadow-2xl shadow-slate-950/40 backdrop-blur-xl`}
      role="alert"
      aria-live="assertive"
    >
      <svg
        className={`mt-0.5 h-5 w-5 shrink-0 ${tone.iconColor}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {tone.icon}
      </svg>
      <p className="flex-1 pt-px text-sm leading-5 text-slate-200">{msg.content}</p>
      <button
        onClick={() => onClose(msg.id)}
        className="mt-0.5 shrink-0 cursor-pointer rounded-lg p-0.5 text-slate-500 transition-colors hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        aria-label="关闭"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

const MessageContainer = () => {
  const [messages, setMessages] = useState([])

  useEffect(() => message.subscribe(setMessages), [])

  if (messages.length === 0) return null

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[9999] flex flex-col items-center gap-2 px-4">
      {messages.map((msg) => (
        <MessageItem key={msg.id} msg={msg} onClose={message.remove} />
      ))}
    </div>,
    document.body,
  )
}

export { MessageContainer }
export default message
