import { Box, Button, Card, CircularProgress, Grid, Paper, Stack, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import Heading from './Heading'
import { Flip, ToastContainer } from 'react-toastify'
import Search from './Search'
import Actions from './Actions'
import NewExpense from './NewExpense'

// import icon from '../assets/Female-Dentist.svg'
import icon from '../assets/dentist.png'
import PatientRecords from './PatientRecords'
import Settings from './Settings'
import PatientList from './PatientLists'
import TransactionReports from './TransactionReports'

const Home = () => {
  const ipcRenderer = window.ipcRenderer

  const expenseModalRef = useRef()
  const settingModalRef = useRef()
  const transactionReportRef = useRef()

  const [search, setsearch] = useState('')
  const [filterPatientsData, setFilterPatientsData] = useState([])
  const [filteredInstallmentPatientsData, setFilteredInstallmentPatientsData] = useState([])

  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const [installmentPatients, setInstallmentPatients] = useState([])
  const [isRenderingInstallmentPatients, setIsRenderingInstallmentPatients] = useState(true)
  const [isRenderingPatients, setIsRenderingPatients] = useState(true)
  const [Patients, setPatients] = useState([])

  // Get selected treatment
  const [dropdownData, setDropdownData] = useState([])
  const [dropDownItems, setDropDownItems] = useState([])
  const [selectedTreatment, setSelectedTreatment] = useState()
  const [selectedTreatmentItem, setSelectedTreatmentItem] = useState()

  useEffect(() => {
    ipcRenderer.send('get-patients')
    ipcRenderer.send('get-installment-patients')
    ipcRenderer.send('getting-dropdown')

    ipcRenderer.on('dropdown-data', (e, args) => {
      const data = JSON.parse(args)

      setDropdownData(data)
      console.log('firstdata: ', data[0].ref)
      setSelectedTreatment(data[0].ref)
    })
    ipcRenderer.on('dropdown-item', (e, args) => {
      const items = JSON.parse(args)
      setDropDownItems(items)
    })
    ipcRenderer.on('treatment-items', (e, args) => {
      const treatmentItems = JSON.parse(args)
      console.log(treatmentItems, treatmentItems[0]?.itemName)
      setDropDownItems(treatmentItems)
      setSelectedTreatmentItem(treatmentItems[0]?.itemName)
    })

    ipcRenderer.on('brace-patients', (e, args) => {
      console.log('loading installment patients')

      setInstallmentPatients(JSON.parse(args))
      setIsRenderingInstallmentPatients(false)
    })

    ipcRenderer.on('patients', (e, args) => {
      console.log('loading patient records')

      setPatients(JSON.parse(args))
      setIsRenderingPatients(false)
    })
  }, [])

  useEffect(() => {
    ipcRenderer.send('get-treatment-items', selectedTreatment)
  }, [selectedTreatment])

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
      <Grid container>
        <Grid item xs={7}>
          <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
            <img src={icon} alt="heading image" width={100} height={100} />
            <Typography variant="h2" textAlign={'center'}>
              Estrella dental app
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={5}>
          <Heading />
        </Grid>
      </Grid>

      <Stack
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        width={'100%'}
      >
        <Search search={search} setsearch={setsearch} />
        <Actions
          expenseModalRef={expenseModalRef}
          settingModalRef={settingModalRef}
          transactionReportRef={transactionReportRef}
        />
      </Stack>

      {/* Patient List */}
      <Grid container spacing={2} my={2}>
        <Grid item xs={6}>
          <PatientList
            patients={search === '' ? installmentPatients : filteredInstallmentPatientsData}
            isRenderingInstallmentPatients={isRenderingInstallmentPatients}
            setIsRenderingInstallmentPatients={setIsRenderingInstallmentPatients}
            dropDownItems={dropDownItems}
            dropdownData={dropdownData}
            selectedTreatment={selectedTreatment}
            setSelectedTreatment={setSelectedTreatment}
            selectedTreatmentItem={selectedTreatmentItem}
            setSelectedTreatmentItem={setSelectedTreatmentItem}
          />
        </Grid>

        {/* Patient Record */}
        <Grid item xs={6}>
          <PatientRecords
            patients={search === '' ? Patients : filterPatientsData}
            isRenderingPatients={isRenderingPatients}
            setIsRenderingPatients={setIsRenderingPatients}
            dropDownItems={dropDownItems}
            dropdownData={dropdownData}
            selectedTreatment={selectedTreatment}
            setSelectedTreatment={setSelectedTreatment}
            selectedTreatmentItem={selectedTreatmentItem}
            setSelectedTreatmentItem={setSelectedTreatmentItem}
          />
        </Grid>
      </Grid>

      <NewExpense expenseModalRef={expenseModalRef} />

      <Settings
        settingModalRef={settingModalRef}
        dropdownData={dropdownData}
        dropDownItems={dropDownItems}
        selectedTreatment={selectedTreatment}
        selectedTreatmentItem={selectedTreatmentItem}
        setSelectedTreatment={setSelectedTreatment}
        setSelectedTreatmentItem={setSelectedTreatmentItem}
      />

      <TransactionReports transactionReportRef={transactionReportRef} dropdownData={dropdownData} />

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
