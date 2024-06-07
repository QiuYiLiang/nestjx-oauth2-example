import axios from 'axios'

function App() {
  return (
    <>
      App1
      <button
        onClick={async () => {
          const data = (await axios.get('/api/auth/getUserInfo')).data
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
