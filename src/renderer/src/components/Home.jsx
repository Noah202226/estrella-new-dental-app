import { Box, Button, Card, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import Heading from './Heading'
import { Flip, ToastContainer } from 'react-toastify'
import Search from './Search'
import Actions from './Actions'
import NewExpense from './NewExpense'

const Home = () => {
  const ipcRenderer = window.ipcRenderer

  const expenseModalRef = useRef()

  const [search, setsearch] = useState('')
  const [filterPatientsData, setFilterPatientsData] = useState([])
  const [filteredInstallmentPatientsData, setFilteredInstallmentPatientsData] = useState([])

  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const [installmentPatients, setInstallmentPatients] = useState([])
  const [isRenderingInstallmentPatients, setIsRenderingInstallmentPatients] = useState(true)
  const [isRenderingPatients, setIsRenderingPatients] = useState(true)
  const [Patients, setPatients] = useState([])
  useEffect(() => {
    ipcRenderer.send('get-patients')
    ipcRenderer.send('get-installment-patients')

    ipcRenderer.on('brace-patients', (e, args) => {
      setInstallmentPatients(JSON.parse(args))
      setIsRenderingInstallmentPatients(false)
    })

    ipcRenderer.on('patients', (e, args) => {
      setPatients(JSON.parse(args))
      setIsRenderingPatients(false)
    })
  }, [])

  // search
  useEffect(() => {
    if (isInitialLoad) {
      // Skip running the code on the initial load
      setIsInitialLoad(false)
      return
    }

    const filteredPatients = Patients.filter((patient) =>
      patient.patientName.toLowerCase().includes(search.toLowerCase())
    )
    const filteredInstallmentPatients = installmentPatients.filter((patient) =>
      patient.patientName.toLowerCase().includes(search.toLowerCase())
    )

    setFilterPatientsData(filteredPatients)
    setFilteredInstallmentPatientsData(filteredInstallmentPatients)
  }, [search])
  return (
    <Box p={1}>
      <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Typography variant="h2" textAlign={'center'}>
          Estrella dental app
        </Typography>
        <Heading />
      </Stack>

      <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Search search={search} setsearch={setsearch} />
        <Actions expenseModalRef={expenseModalRef} />
      </Stack>

      <Grid container spacing={2} my={2}>
        <Grid item xs={6}>
          <Typography>Patient List</Typography>
          {isRenderingInstallmentPatients ? (
            <CircularProgress />
          ) : search === '' ? (
            installmentPatients?.map((patient) => (
              <Card
                key={patient?._id}
                sx={{
                  mb: 2,
                  p: 1,
                  cursor: 'pointer',
                  transition: 'all 0.1s',
                  '&:hover': {
                    boxShadow: '4px 4px 8px 4px rgba(20,50,80,5)',
                    marginLeft: 1
                  }
                }}
              >
                <Typography variant="h5">{patient?.patientName}</Typography>
                <Typography variant="h6">{patient?.patientAddress}</Typography>
                <Typography variant="h6">{patient?.patientAge}</Typography>
                <Typography variant="h6">{patient?.treatmentType}</Typography>
                <Typography variant="h6">{patient?.treatmentRendered}</Typography>
                <Typography variant="h6">{patient?.servicePrice}</Typography>
                <Typography variant="h6">{patient?.initialPay}</Typography>
                <Typography variant="h6">{patient?.remainingBal}</Typography>
              </Card>
            ))
          ) : (
            filteredInstallmentPatientsData?.map((patient) => (
              <Card key={patient?._id}>
                <Typography>{patient?.patientName}</Typography>
              </Card>
            ))
          )}
        </Grid>

        {/* Patient Record */}
        <Grid item xs={6}>
          <Typography>Patient Records</Typography>
          {isRenderingPatients ? (
            <CircularProgress />
          ) : search === '' ? (
            Patients?.map((patient) => (
              <Card
                key={patient?._id}
                sx={{
                  mb: 2,
                  p: 1,
                  cursor: 'pointer',
                  transition: 'all 0.1s',
                  '&:hover': {
                    boxShadow: '4px 4px 8px 4px rgba(20,50,80,5)',
                    marginLeft: 1
                  }
                }}
              >
                <Stack flexDirection={'row'} justifyContent={'space-between'}>
                  <Stack>
                    <Typography variant="h5">{patient?.patientName}</Typography>
                    <Typography variant="h6">{patient?.homeAddress}</Typography>
                  </Stack>
                  <Stack flexDirection={'row'}>
                    <Button size="small" variant="contained">
                      Info
                    </Button>
                    <Button size="small" variant="contained" color="error">
                      Delete
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            ))
          ) : (
            filterPatientsData?.map((patient) => (
              <Card key={patient?._id} sx={{ my: 2 }}>
                <Typography>{patient?.patientName}</Typography>
                <Typography>{patient?.homeAddress}</Typography>
              </Card>
            ))
          )}
        </Grid>
      </Grid>

      <NewExpense expenseModalRef={expenseModalRef} />

      <ToastContainer
        autoClose={1000}
        position="top-center"
        transition={Flip}
        containerId={'home-notifications'}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
    </Box>
  )
}

export default Home
