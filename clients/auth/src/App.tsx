import { useEffect, useRef, useState } from 'react'
import axios from 'axios'

const isLogout = location.pathname.startsWith('/logout')

function App() {
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({
    email: 'zhangsan@gmail.com',
    password: 'sup233erWE-!@#',
  })

  const [mode, setMode] = useState('padding')

  useEffect(() => {
    axios.post('/api/auth/interaction/getStatus').then((res) => {
      setMode(res.data.mode)
    })
  }, [])
  const login = async () => {
    const {
      data: { success, data },
    } = await axios.post(`/api/auth/interaction/login`, form)
    if (success) {
      location.href = data
    }
  }
  const authorization = async () => {
    const {
      data: { success, data },
    } = await axios.post(`/api/auth/interaction/authorization`)
    if (success) {
      location.href = data
    }
  }

  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    if (!isLogout) {
      return
    }
    formRef.current?.submit()
  }, [])
  if (isLogout) {
    const xsrf = new URLSearchParams(location.search).get('xsrf') as string
    return (
      <form
        ref={formRef}
        method='post'
        action='/api/auth/oidc/session/end/confirm'
      >
        <input type='hidden' name='xsrf' value={xsrf} />
        <input type='hidden' name='logout' value='yes' />
      </form>
    )
  }
  if (mode === 'authorization') {
    return <button onClick={authorization}>同意授权</button>
  }
  if (mode === 'autoAuthorization') {
    authorization()
  }
  if (mode === 'login') {
    return (
      <div
        style={{
          width: 200,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isRegister ? (
          <>
            <div>
              名称：
              <input
                name='fullName'
                value={form.fullName}
                onChange={(e) => {
                  setForm((form) => ({ ...form, fullName: e.target.value }))
                }}
              />
            </div>
            <div>
              邮箱：
              <input
                name='email'
                value={form.email}
                onChange={(e) => {
                  setForm((form) => ({ ...form, email: e.target.value }))
                }}
              />
            </div>
            <div>
              密码：
              <input
                name='password'
                value={form.password}
                onChange={(e) => {
                  setForm((form) => ({ ...form, password: e.target.value }))
                }}
              />
            </div>
            <button
              onClick={() => {
                setForm({})
                setIsRegister(false)
              }}
            >
              返回登陆
            </button>
            <button
              onClick={async () => {
                const user = await axios.post(`/api/auth/user/register`, form)
                if (user) {
                  alert('注册成功，准备跳转')
                  await login()
                }
              }}
            >
              确认注册
            </button>
          </>
        ) : (
          <>
            <div>
              邮箱：
              <input
                name='email'
                value={form.email}
                onChange={(e) => {
                  setForm((form) => ({ ...form, email: e.target.value }))
                }}
              />
            </div>
            <div>
              密码：
              <input
                name='password'
                value={form.password}
                onChange={(e) => {
                  setForm((form) => ({ ...form, password: e.target.value }))
                }}
              />
            </div>
            <button
              onClick={async () => {
                await login()
              }}
            >
              登陆
            </button>
            <button
              onClick={() => {
                setForm({})
                setIsRegister(true)
              }}
            >
              注册
            </button>
          </>
        )}
      </div>
    )
  }
}

export default App
