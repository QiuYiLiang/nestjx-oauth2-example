function App() {
  return (
    <>
      App1
      <button
        onClick={async () => {
          location.href = '/api/logout'
        }}
      >
        退出登陆
      </button>
    </>
  )
}

export default App
