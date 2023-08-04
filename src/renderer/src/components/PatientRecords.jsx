import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'

import React, { useEffect, useRef, useState } from 'react'
import { Flip, ToastContainer, toast } from 'react-toastify'
import NewPatientRecord from './NewPatientRecord'

const PatientRecords = ({
  patients,
  isRenderingPatients,
  setIsRenderingPatients,
  dropdownData,
  dropDownItems,
  selectedTreatment,
  setSelectedTreatment,
  selectedTreatmentItem,
  setSelectedTreatmentItem
}) => {
  const ipcRenderer = window.ipcRenderer
  const patientInfoRef = useRef()
  const newPatientRecordRef = useRef()

  const [patientRecord, setPatientRecord] = useState()
  const [isGettingPatientData, setIsGettingPatientData] = useState(true)
  const [dateTransact, setDateTransact] = useState()
  const [patientName, setPatientName] = useState()
  const [patientAge, setPatientAge] = useState()
  const [patientGender, setPatientGender] = useState()
  const [patientBirthOfPlace, setPatientBirthOfPlace] = useState()
  const [patientNationality, setPatientNationality] = useState()
  const [patientCivilStatus, setPatientCivilStatus] = useState()
  const [patientOccupation, setPatientOccupation] = useState()
  const [patientHomeAddress, setPatientHomeAddress] = useState()
  const [patientContact, setPatientContact] = useState()
  const [patientPersonToContact, setPatientPersonToContact] = useState()
  const [patientPersonToContactRelation, setPatientPersonToContactRelation] = useState()
  const [patientPersonToContactNumber, setPatientPersonToContactNumber] = useState()
  const [patientMedicalHistory, setPatientMedicalHistory] = useState()

  const [patientTransactions, setPatientTransactions] = useState([])
  const [isGettingPatientTx, setIsGettingPatientTx] = useState(true)

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value
    setSelectedTreatment(selectedValue)

    // Update options based on the selected value
    // const updatedOptions = getUpdatedOptions(selectedValue)
    // setOptions(updatedOptions)
  }

  //   Set date to now
  const [dateNow, setDateNow] = useState('')
  useEffect(() => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const day = currentDate.getDate().toString().padStart(2, '0')

    const formattedDate = `${year}-${month}-${day}`

    setDateNow(formattedDate)
  }, [])

  const updatePatientData = () => {
    const data = {
      dateTransact,
      patientName,
      patientAge,
      patientGender,
      placeOfBirth: patientBirthOfPlace,
      nationality: patientNationality,
      civilStatus: patientCivilStatus,
      occupation: patientOccupation,
      homeAddress: patientHomeAddress,
      contactNumber1: patientContact,
      personToContact: patientPersonToContact,
      personRelation: patientPersonToContactRelation,
      personContactNumber: patientPersonToContactNumber
    }
    ipcRenderer.send('update-patient-data', { idToUpdate: patientRecord?._id, data })
  }

  useEffect(() => {
    ipcRenderer.on('patient-record', (e, args) => {
      const data = JSON.parse(args)
      setPatientRecord(data)

      setDateTransact(data?.dateTransact)
      setPatientName(data?.patientName)
      setPatientAge(data?.patientAge)
      setPatientGender(data?.patientGender)
      setPatientBirthOfPlace(data?.placeOfBirth)
      setPatientNationality(data?.nationality)
      setPatientCivilStatus(data?.civilStatus)
      setPatientOccupation(data?.occupation)
      setPatientHomeAddress(data?.homeAddress)
      setPatientContact(data?.contactNumber1)
      setPatientPersonToContact(data?.personToContact)
      setPatientPersonToContactRelation(data?.personRelation)
      setPatientPersonToContactNumber(data?.personContactNumber)
      setPatientMedicalHistory(data?.medicalAndDentalHistory)

      setIsGettingPatientData(false)
    })

    ipcRenderer.on('patient-data-updated', () => {
      setIsRenderingPatients(true)
      toast.success('Patient Data Updated.', { containerId: 'home-notifications' })

      //   Reload home date
      ipcRenderer.send('get-patients')

      patientInfoRef.current.close()
    })
    ipcRenderer.on('patient-data-update-error', (e, args) => {
      toast.success('Error.' + args, { containerId: 'patient-data-notifications' })
    })

    ipcRenderer.on('patient-txs', (e, args) => {
      setPatientTransactions(JSON.parse(args))
      setIsGettingPatientTx(false)
    })

    ipcRenderer.on('tx-deleted', (e, args) => {
      setIsRenderingPatients(true)
      patientInfoRef.current.close()
      toast.success('Transaction deleted', { containerId: 'home-notifications' })

      //   Reload home date
      ipcRenderer.send('get-patients')
    })
    ipcRenderer.on('error-deleting-tx', (e, args) => {
      toast.success('Deleting transaction failed' + args, {
        containerId: 'patient-data-notifications'
      })
    })

    ipcRenderer.on('patient-record-deleted', (e, args) => {
      setIsRenderingPatients(true)
      patientInfoRef.current.close()

      toast.success('Patient Record deleted', { containerId: 'home-notifications' })

      //   Reload home date
      ipcRenderer.send('get-patients')
    })

    ipcRenderer.on('error-deleting-patient', (e, args) => {
      toast.error('Error deleting patient' + args, { containerId: 'home-notifications' })
    })

    // New Sale
    ipcRenderer.on('new-sale-saved', (e, args) => {
      setIsRenderingPatients(true)

      patientInfoRef.current.close()
      toast.success('New sale saved.', { containerId: 'home-notifications' })
      setNewSaleAmount(0)

      //   Reload home date
      ipcRenderer.send('get-patients')
    })
  }, [])

  const deletePatientRecord = (id) => {
    ipcRenderer.send('delete-patient-record', id)
  }

  const getPatientRecord = (id, name) => {
    setIsGettingPatientData(true)
    setIsGettingPatientTx(true)

    ipcRenderer.send('get-patient-record', id)
    ipcRenderer.send('get-patient-tx', name)
  }

  const deleteTx = (id) => {
    ipcRenderer.send('delete-tx', id)
  }

  const [newSaleAmount, setNewSaleAmount] = useState(0)
  const newsale = () => {
    console.log(newSaleAmount)
    ipcRenderer.send('new-sale', {
      dateTransact: dateNow,
      patientName,
      treatmentRendered: selectedTreatment,
      treatmentType: selectedTreatmentItem,
      amountPaid: newSaleAmount
    })
  }

  return (
    <div>
      <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Typography>Patient Records</Typography>

        <Button
          size="small"
          variant="contained"
          onClick={() => {
            newPatientRecordRef.current.showModal()
          }}
        >
          New
        </Button>
      </Stack>

      <Paper
        className="scrollable-div"
        sx={{
          padding: 1,
          overflow: 'auto',
          height: 454
        }}
      >
        {isRenderingPatients ? (
          <CircularProgress />
        ) : (
          patients?.map((patient) => (
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
              <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Stack>
                  <Typography variant="h5">{patient?.patientName}</Typography>
                  <Typography variant="h6">{patient?.homeAddress}</Typography>
                </Stack>
                <Stack flexDirection={'row'} justifyContent={'space-around'} width={'30%'}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => {
                      getPatientRecord(patient._id, patient.patientName)
                      patientInfoRef.current.showModal()
                    }}
                  >
                    Info
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => deletePatientRecord(patient._id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </Card>
          ))
        )}
      </Paper>

      <dialog ref={patientInfoRef} style={{ width: '100%', height: '100%' }}>
        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Typography variant="h4">Patient Record Info</Typography>
          <Button variant="contained" color="error" onClick={() => patientInfoRef.current.close()}>
            Close
          </Button>
        </Stack>

        <Grid container spacing={1}>
          <Grid item xs={6.5}>
            {isGettingPatientData ? (
              <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Typography>
                  Transaction Date:{' '}
                  {new Date(dateTransact).toLocaleString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>

                <Stack
                  flexDirection={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  my={1}
                >
                  <TextField
                    label="Patient Name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                  <TextField
                    label="Age"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                  />
                  <TextField
                    label="Gender"
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                  />
                </Stack>

                <Stack
                  flexDirection={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  my={2}
                >
                  <TextField
                    label="Place of Birth"
                    value={patientBirthOfPlace}
                    onChange={(e) => setPatientBirthOfPlace(e.target.value)}
                  />
                  <TextField
                    label="Nationality"
                    value={patientNationality}
                    onChange={(e) => setPatientNationality(e.target.value)}
                  />
                  <TextField
                    label="Civil Status"
                    value={patientCivilStatus}
                    onChange={(e) => setPatientCivilStatus(e.target.value)}
                  />
                </Stack>

                <Stack
                  flexDirection={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  my={2}
                >
                  <TextField
                    label="Occupation"
                    value={patientOccupation}
                    onChange={(e) => setPatientOccupation(e.target.value)}
                  />
                  <TextField
                    label="Home Address"
                    value={patientHomeAddress}
                    onChange={(e) => setPatientHomeAddress(e.target.value)}
                  />
                  <TextField
                    label="Contact #"
                    value={patientContact}
                    onChange={(e) => setPatientContact(e.target.value)}
                  />
                </Stack>

                <Stack
                  flexDirection={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  my={2}
                >
                  <TextField
                    label="Person to contact incase of Emergency"
                    value={patientPersonToContact}
                    onChange={(e) => setPatientPersonToContact(e.target.value)}
                  />
                  <TextField
                    label="Relation"
                    value={patientPersonToContactRelation}
                    onChange={(e) => setPatientPersonToContactRelation(e.target.value)}
                  />
                  <TextField
                    label="Contact #"
                    value={patientPersonToContactNumber}
                    onChange={(e) => setPatientPersonToContactNumber(e.target.value)}
                  />
                </Stack>
                <TextField
                  sx={{ my: 2 }}
                  fullWidth
                  label="Medical and Dental History"
                  value={patientMedicalHistory}
                  onChange={(e) => setPatientMedicalHistory(e.target.value)}
                />

                <Stack>
                  <Button variant="contained" onClick={updatePatientData}>
                    Update Data
                  </Button>
                </Stack>
              </>
            )}
          </Grid>

          {/* Transactions */}
          <Grid item xs={5.5}>
            <Stack sx={{ background: 'cyan', padding: 1, mt: 1 }}>
              <Typography>New Transactions</Typography>

              <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <TextField
                  type="date"
                  value={dateNow}
                  fullWidth
                  onChange={(e) => setDateNow(e.target.value)}
                />
                <TextField
                  type="number"
                  label="Amount"
                  value={newSaleAmount}
                  onChange={(e) => setNewSaleAmount(e.target.value)}
                />
              </Stack>

              <Stack flexDirection={'row'}>
                <FormControl fullWidth sx={{ position: 'relative', zIndex: 2, my: 1 }}>
                  <Select
                    onChange={handleSelectChange}
                    value={selectedTreatment}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    native
                    sx={{ position: 'relative', zIndex: 2 }}
                    fullWidth
                  >
                    {dropdownData.length > 0 ? (
                      dropdownData.map((option, index) => (
                        <option key={index} value={option?.ref}>
                          {option?.itemName}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value={''}>No Data</option>
                      </>
                    )}
                  </Select>

                  <FormHelperText>Treatment Rendered</FormHelperText>
                </FormControl>

                <FormControl fullWidth sx={{ position: 'relative', zIndex: 2, my: 1 }}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    native
                    sx={{ position: 'relative', zIndex: 2 }}
                    fullWidth
                    value={selectedTreatmentItem}
                    onChange={(e) => setSelectedTreatmentItem(e.target.value)}
                  >
                    {dropDownItems.length > 0 ? (
                      dropDownItems.map((option, index) => (
                        <option key={index} value={option?.itemName}>
                          {option?.itemName}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value={''}>No Data</option>
                      </>
                    )}
                  </Select>

                  <FormHelperText>Treatment Type</FormHelperText>
                </FormControl>
              </Stack>

              <Button variant="contained" color="success" onClick={newsale}>
                Submit
              </Button>
            </Stack>

            <Typography variant="h6">Transactions</Typography>
            <Paper
              className="scrollable-div"
              style={{
                overflow: 'auto',
                transform: 'translateZ(0)',
                height: 350,
                backfaceVisibility: 'hidden',
                fontSmooth: 'always'
              }}
            >
              {isGettingPatientTx ? (
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                  <CircularProgress />
                </Box>
              ) : (
                patientTransactions?.map((tx) => (
                  <Card key={tx._id} style={{ marginBottom: 10, padding: 10 }}>
                    <Typography>
                      Transaction Date:{' '}
                      {new Date(tx.dateTransact).toLocaleString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                    <Typography>Treatment Rendered: {tx.treatmentRendered}</Typography>
                    <Typography>Treatment Type: {tx.treatmentType}</Typography>
                    <Typography>Treatment Type: {tx.amountPaid}</Typography>

                    <Button variant="contained" color="error" onClick={() => deleteTx(tx._id)}>
                      Delete
                    </Button>
                  </Card>
                ))
              )}
            </Paper>
          </Grid>
        </Grid>

        <ToastContainer
          autoClose={1000}
          position="top-center"
          transition={Flip}
          containerId={'patient-data-notifications'}
          pauseOnFocusLoss={false}
          pauseOnHover={false}
        />
      </dialog>

      <NewPatientRecord
        newPatientRecordRef={newPatientRecordRef}
        dropdownData={dropdownData}
        dropDownItems={dropDownItems}
        selectedTreatment={selectedTreatment}
        selectedTreatmentItem={selectedTreatmentItem}
        setSelectedTreatment={setSelectedTreatment}
        setSelectedTreatmentItem={setSelectedTreatmentItem}
      />
    </div>
  )
}

export default PatientRecords
