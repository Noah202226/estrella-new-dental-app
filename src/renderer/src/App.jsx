import { Card, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Home from './components/Home'
import Login from './components/Login'
const ipcRenderer = window.ipcRenderer
function App() {
  const [isLogin, setIsLogin] = useState(true)

  return <div>{isLogin ? <Home /> : <Login isLogin={isLogin} setIsLogin={setIsLogin} />}</div>
}

export default App
