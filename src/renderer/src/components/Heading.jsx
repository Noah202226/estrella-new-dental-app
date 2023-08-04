import { Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

const Heading = () => {
  const [dateTime, setDateTime] = useState(
    Date.now().toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
  )
  useEffect(() => {
    setInterval(() => {
      const datetimeNow = new Date()
      setDateTime(
        datetimeNow.toLocaleString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        })
      )
    }, 1000)
  }, [])
  return (
    <Stack alignItems={'center'} justifyContent={'center'}>
      <Typography variant="h5" fontSize={29} padding={1}>
        {dateTime}
      </Typography>
    </Stack>
  )
}

export default Heading
