let nextId = 0
let messages = []
let listener = null

const notify = () => {
  if (listener) listener([...messages])
}

const remove = (id) => {
  const msg = messages.find((m) => m.id === id)
  if (!msg || msg.closing) return
  msg.closing = true
  notify()
  setTimeout(() => {
    messages = messages.filter((m) => m.id !== id)
    notify()
  }, 200)
}

const add = (type, content, duration = 3000) => {
  const id = ++nextId
  const msg = { id, type, content, closing: false }
  messages = [...messages, msg]
  notify()

  if (duration > 0) {
    setTimeout(() => remove(id), duration)
  }

  return id
}

const message = {
  success: (content, duration) => add('success', content, duration),
  error: (content, duration) => add('error', content, duration),
  warning: (content, duration) => add('warning', content, duration),
  info: (content, duration) => add('info', content, duration),
  remove,
  subscribe: (fn) => {
    listener = fn
    return () => {
      listener = null
    }
  },
}

export default message
