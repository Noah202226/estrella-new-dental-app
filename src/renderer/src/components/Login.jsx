import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { Flip, ToastContainer, toast } from 'react-toastify'

const Login = ({ isLogin, setIsLogin }) => {
  const ipcRenderer = window.ipcRenderer
  const loginFormRef = useRef()

  const checkUser = (e) => {
    e.preventDefault()
    const data = {
      user: loginFormRef.current.children[0].children[0].children[0].value,
      password: loginFormRef.current.children[1].children[0].children[0].value
    }

    ipcRenderer.send('check-user', { data })
  }

  useEffect(() => {
    ipcRenderer.on('login-status', (e, args) => {
      if (args === null) {
        toast.error('User not found', { containerId: 'login-notifications' })
      } else {
        toast.success('Login successfully', { containerId: 'login-notifications' })

        setTimeout(() => {
          setIsLogin(true)
        }, 3000)
      }
    })
  })
  return (
    <Box>
      <Typography variant="h3">Login</Typography>

      <form ref={loginFormRef} onSubmit={checkUser}>
        <TextField placeholder="Username" />
        <TextField placeholder="Username" />

        <Button type="submit">Login</Button>
      </form>

      <ToastContainer
        autoClose={1000}
        position="top-center"
        transition={Flip}
        containerId={'login-notifications'}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
    </Box>
  )
}

export default Login
