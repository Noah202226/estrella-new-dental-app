import { useEffect, useState } from 'react'
import Home from './components/Home'
import Login from './components/Login'
const ipcRenderer = window.ipcRenderer
function App() {
  const [isLogin, setIsLogin] = useState(false)

  return isLogin ? <Home /> : <Login isLogin={isLogin} setIsLogin={setIsLogin} />
}

export default App
