import { request } from './request'

function App() {
  return (
    <>
      App2
      <button
        onClick={async () => {
          const data = await request('/getUserInfo', {})
          if (data.success === false) {
            location.href = data.data
            return
          }
          console.log(data)
        }}
      >
        测试接口
      </button>
    </>
  )
}

export default App
