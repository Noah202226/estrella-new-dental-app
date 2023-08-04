import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Flip, ToastContainer, toast } from 'react-toastify'
import icon from '../assets/Female-Dentist.svg'
import icon2 from '../assets/dentist.png'

const Login = ({ isLogin, setIsLogin }) => {
  const ipcRenderer = window.ipcRenderer
  const loginFormRef = useRef()

  const [imgSrc, setImgSrc] = useState(icon)

  const checkUser = (e) => {
    e.preventDefault()
    // console.log(loginFormRef.current.children[0].children[0].children[0].children[0].value)
    const data = {
      user: loginFormRef.current.children[0].children[0].children[0].children[0].value,
      password: loginFormRef.current.children[0].children[1].children[0].children[0].value
    }

    ipcRenderer.send('check-user', { data })
  }

  useEffect(() => {
    ipcRenderer.on('login-status', (e, args) => {
      if (args === null) {
        toast.error('User not found', { containerId: 'login-notifications' })
      } else {
        toast.success('Login successfully', { containerId: 'login-notifications' })
        setImgSrc(icon2)
        setTimeout(() => {
          setIsLogin(true)
        }, 3000)
      }
    })
  })
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', mt: 20 }}>
      <Box>
        <img
          style={{ position: 'absolute', top: 50, left: 750, zIndex: -999 }}
          src={imgSrc}
          alt="heading image"
          width={300}
          height={300}
        />
        <Typography variant="h3">Estrella Dental Clinic</Typography>

        <form ref={loginFormRef} onSubmit={checkUser}>
          <Stack>
            <TextField placeholder="Username" sx={{ my: 2 }} />
            <TextField type="password" placeholder="Password" sx={{ my: 2 }} />

            <Button variant="contained" type="submit" sx={{ my: 2 }}>
              Login
            </Button>
          </Stack>
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
    </Box>
  )
}

export default Login
