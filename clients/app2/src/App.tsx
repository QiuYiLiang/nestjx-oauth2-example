function App() {
  return (
    <>
      App2
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
