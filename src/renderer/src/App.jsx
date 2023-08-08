import { useEffect, useRef, useState } from 'react'
import Home from './components/Home'
import Login from './components/Login'
import { Button, Stack, Typography } from '@mui/material'
const ipcRenderer = window.ipcRenderer
function App() {
  const [isLogin, setIsLogin] = useState(false)

  const ipcRenderer = window.ipcRenderer

  const exitRef = useRef()

  const exitApp = () => {
    ipcRenderer.send('exit-app')
  }

  useEffect(() => {
    ipcRenderer.on('closing-app', () => exitRef.current.showModal())
  }, [])

  return (
    <>
      <dialog
        ref={exitRef}
        style={{
          width: 280,

          padding: 10,
          height: 100,
          borderRadius: 30
        }}
      >
        <Typography variant="h6" textAlign={'center'} fontStyle={'italic'}>
          Do you really want to exit?
        </Typography>

        <Stack
          width={'100%'}
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-around'}
          pt={2}
        >
          <Button variant="contained" onClick={exitApp} color="error">
            Exit
          </Button>
          <Button variant="outlined" onClick={() => exitRef.current.close()} color="warning">
            Cancel
          </Button>
        </Stack>
      </dialog>
      {isLogin ? <Home /> : <Login isLogin={isLogin} setIsLogin={setIsLogin} />}
    </>
  )
}

export default App
