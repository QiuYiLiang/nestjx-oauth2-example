import { useState } from 'react'
import axios from 'axios'

function App() {
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})
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
              console.log(user)
              if (user) {
                alert('注册成功，准备跳转')
                // await axios.post(`${location.pathname}/login`, {})
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
              await axios.post(
                `/api/auth/interaction${location.pathname}/login`,
                form
              )
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

export default App
