function App() {
  return (
    <>
      App1
      <button
        onClick={async () => {
          const data = await fetch('/api/auth/getData')
          console.log(data)
        }}
      >
        测试接口
      </button>
    </>
  )
}

export default App
