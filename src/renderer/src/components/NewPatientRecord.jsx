import {
  Autocomplete,
  Button,
  Card,
  FormControl,
  FormHelperText,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'

const NewPatientRecord = ({
  newPatientRecordRef,
  setIsRenderingPatients,
  dropdownData,
  dropDownItems,
  selectedTreatment,
  setSelectedTreatment,
  selectedTreatmentItem,
  setSelectedTreatmentItem
}) => {
  const ipcRenderer = window.ipcRenderer

  const [dateNow, setDateNow] = useState('')
  useEffect(() => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const day = currentDate.getDate().toString().padStart(2, '0')

    const formattedDate = `${year}-${month}-${day}`

    setDateNow(formattedDate)

    ipcRenderer.on('new-patient-record-saved', (e, args) => {
      setIsRenderingPatients(true)
      toast.success('New Patient Saved.', { containerId: 'home-notifications' })

      ipcRenderer.send('get-patients')

      newPatientRecordRef.current.close()
    })
  }, [])
  // inputs ref on new patient dialog
  const surnameRef = useRef()
  const givenNameRef = useRef()
  const middleNameRef = useRef()

  const ageRef = useRef()
  const [genderRef, setGenderRef] = useState('')
  const birthOfPlaceRef = useRef()

  const nationalityRef = useRef()
  const civilStatusRef = useRef()

  const occupationRef = useRef()
  const homeAddressRef = useRef()
  const personalContactRef = useRef()

  const emergencyToContactRef = useRef()
  const relationRef = useRef()
  const emergencyToContactNoRef = useRef()

  const medicalHistoryRef = useRef()

  const amountRef = useRef()

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value
    setSelectedTreatment(selectedValue)

    // // Update options based on the selected value
    // const updatedOptions = getUpdatedOptions(selectedValue)
    // setOptions(updatedOptions)
  }
  const submitForm = (e) => {
    e.preventDefault()

    // console.log(birthOfPlaceRef.current.children[1].children[0].value)

    const patientData = {
      dateTransact: dateNow,
      patientName: `${givenNameRef.current.children[1].children[0].value} ${middleNameRef.current.children[1].children[0].value} ${surnameRef.current.children[1].children[0].value}`,
      patientAge: ageRef.current.children[1].children[0].value,
      patientGender: genderRef,
      placeOfBirth: birthOfPlaceRef.current.children[1].children[0].value,
      nationality: nationalityRef.current.children[0].children[1].children[0].value,
      civilStatus: civilStatusRef.current.children[0].children[1].children[0].value,
      occupation: occupationRef.current.children[1].children[0].value,
      homeAddress: homeAddressRef.current.children[1].children[0].value,
      contactNumber1: personalContactRef.current.children[1].children[0].value,
      personToContact: emergencyToContactRef.current.children[1].children[0].value,
      personRelation: relationRef.current.children[1].children[0].value,
      personContactNumber: emergencyToContactNoRef.current.children[1].children[0].value,
      medicalAndDentalHistory: medicalHistoryRef.current.children[1].children[0].value
    }
    const sale = {
      dateTransact: dateNow,
      patientName: `${givenNameRef.current.children[1].children[0].value} ${middleNameRef.current.children[1].children[0].value} ${surnameRef.current.children[1].children[0].value}`,
      treatmentRendered: selectedTreatment,
      treatmentType: selectedTreatmentItem,
      amountPaid: amountRef.current.children[0].children[0].value
    }

    console.log(patientData)
    // console.log(sale)

    ipcRenderer.send('new-patient-record', patientData)
    ipcRenderer.send('new-sale', sale)

    newPatientRecordRef.current.close()

    // Reset fields
    givenNameRef.current.children[1].children[0].value = ''
    middleNameRef.current.children[1].children[0].value = ''
    surnameRef.current.children[1].children[0].value = ''
    ageRef.current.children[1].children[0].value = ''
    setGenderRef('male')
    birthOfPlaceRef.current.children[0].children[1].children[0].value = ''
    nationalityRef.current.children[0].children[1].children[0].value = ''
    civilStatusRef.current.children[0].children[1].children[0].value = ''
    occupationRef.current.children[1].children[0].value = ''
    homeAddressRef.current.children[1].children[0].value = ''
    personalContactRef.current.children[1].children[0].value = ''
    emergencyToContactRef.current.children[1].children[0].value = ''
    relationRef.current.children[1].children[0].value = ''
    emergencyToContactNoRef.current.children[1].children[0].value = ''
    medicalHistoryRef.current.children[1].children[0].value = ''

    amountRef.current.children[0].children[0].value = ''
  }
  return (
    <dialog
      ref={newPatientRecordRef}
      style={{
        position: 'relative',
        zIndex: 9999999,
        width: '100%',
        height: 700,
        backgroundImage: 'url("../../resources/dentist.png")',
        backgroundSize: '200px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom',
        backgroundPositionX: 'right'
      }}
    >
      <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
        <Typography variant="h6">Patient Record</Typography>
        <Button
          variant="contained"
          color="error"
          onClick={() => newPatientRecordRef.current.close()}
        >
          Close
        </Button>
      </Stack>

      <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} mb={1}>
        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} mb={1}>
          <TextField
            type="text"
            label="Surname"
            ref={surnameRef}
            className="capitalize"
            sx={{ mr: 2 }}
          />
          <TextField
            type="text"
            label="Given Name"
            ref={givenNameRef}
            className="capitalize"
            sx={{ mr: 2 }}
          />
          <TextField
            type="text"
            label="Middle Name"
            ref={middleNameRef}
            className="capitalize"
            sx={{ mr: 2 }}
          />
        </Stack>

        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} mb={1}>
          <TextField type="number" label="Age" ref={ageRef} sx={{ mr: 2 }} />

          <FormControl sx={{ position: 'relative', zIndex: 2 }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              native
              sx={{ position: 'relative', zIndex: 2, width: 200 }}
              value={genderRef}
              onChange={(e) => setGenderRef(e.target.value)}
            >
              <option value={'male'}>MALE</option>
              <option value={'female'}>FEMALE</option>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
        <TextField type="type" label="Birth of Place" ref={birthOfPlaceRef} sx={{ mr: 2 }} />

        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} mb={1}>
          <Autocomplete
            disablePortal
            id="combo-box-demo-2"
            options={['Filipino', 'Bisaya', 'Others']}
            sx={{ width: 200, mr: 2 }}
            renderInput={(params) => <TextField {...params} label="Nationality" />}
            ref={nationalityRef}
          />
          {/* <TextField type="text" label="Civil Status" ref={civilStatusRef} className="capitalize" /> */}

          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={['Single', 'Married', 'Widowed']}
            sx={{ width: 200, mr: 2 }}
            renderInput={(params) => <TextField {...params} label="Civil Status" />}
            ref={civilStatusRef}
          />
          <TextField
            type="text"
            label="Occupation"
            ref={occupationRef}
            className="capitalize"
            sx={{ mr: 2 }}
          />
        </Stack>

        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} mb={1}>
          <TextField
            type="text"
            label="Home Address"
            ref={homeAddressRef}
            className="capitalize"
            fullWidth
            sx={{ mr: 2 }}
          />
          <TextField type="number" label="No" ref={personalContactRef} className="capitalize" />
        </Stack>
      </Stack>

      <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} mb={1}>
          <TextField
            type="text"
            label="Person to contact"
            ref={emergencyToContactRef}
            className="capitalize"
            sx={{ mr: 2 }}
          />
          <TextField
            type="text"
            label="Relation"
            ref={relationRef}
            className="capitalize"
            sx={{ mr: 2 }}
          />
          <TextField
            type="number"
            label="No"
            ref={emergencyToContactNoRef}
            className="capitalize"
            sx={{ mr: 2 }}
          />
        </Stack>

        <Stack
          flexDirection={'row'}
          alignItems={'start'}
          justifyContent={'space-between'}
          mb={1}
          width={'50%'}
        >
          <TextField
            type="text"
            label="Medical and Dental History"
            fullWidth
            ref={medicalHistoryRef}
            className="capitalize"
          />
        </Stack>
      </Stack>

      <Card sx={{ background: 'rgba(50,200,150, 0.5)', p: 1, borderRadius: 1, mt: 1 }}>
        <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
          <Typography variant="h6">Form</Typography>

          <Button variant="contained" onClick={submitForm}>
            Submit
          </Button>
        </Stack>

        <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
          <TextField
            type="date"
            helperText="Date Given"
            value={dateNow}
            onChange={(e) => setDateNow(e.target.value)}
          />
          <TextField type="number" helperText="Amount" fullWidth ref={amountRef} />
        </Stack>

        <Stack flexDirection={'row'} alignItems={'start'} justifyContent={'space-between'} mb={1}>
          <FormControl fullWidth sx={{ position: 'relative', zIndex: 2 }}>
            <Select
              onChange={handleSelectChange}
              value={selectedTreatment}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              native
              sx={{ position: 'relative', zIndex: 2, width: 200 }}
              fullWidth
            >
              {/* <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem> */}

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

          <FormControl fullWidth sx={{ position: 'relative', zIndex: 2 }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              native
              sx={{ position: 'relative', zIndex: 2, width: 200 }}
              fullWidth
              value={selectedTreatmentItem}
              onChange={(e) => setSelectedTreatmentItem(e.target.value)}
            >
              {/* <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem> */}

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
      </Card>
    </dialog>
  )
}

export default NewPatientRecord
