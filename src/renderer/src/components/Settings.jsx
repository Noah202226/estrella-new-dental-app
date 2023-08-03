import { DeleteForever, Save, Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { ToastContainer, toast } from 'react-toastify'

const Settings = ({
  settingModalRef,
  settingInfo,
  dropdownData,
  dropDownItems,
  selectedTreatment,
  setSelectedTreatment,
  selectedTreatmentItem,
  setSelectedTreatmentItem
}) => {
  const ipcRenderer = window.ipcRenderer

  const [tabValue, setTabValue] = useState(0)

  function CustomTabPanel(props) {
    const { children, tabValue, index, ...other } = props

    return (
      <div
        role="tabpanel"
        hidden={tabValue !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {tabValue === index && <Box>{children}</Box>}
      </div>
    )
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    tabValue: PropTypes.number.isRequired
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    }
  }

  // New user

  const newUserFormRef = useRef()

  const [newUserName, setNewUserName] = useState()
  const [newUserPass, setNewUserPass] = useState()
  const [newUserAccountType, setNewUserAccountType] = useState()

  const submitNewUser = () => {
    const newUserData = {
      name: newUserName,
      pwd: newUserPass,
      accountType: newUserAccountType
    }

    ipcRenderer.send('new-user', newUserData)
  }

  const [settingsID, setsettingsID] = useState()
  const [loginBgColor, setLoginBgColor] = useState()
  const [loginTitle, setLoginTitle] = useState()
  const [appTitle, setAppTitle] = useState()
  const [homeBgColor, setHomeBgColor] = useState()
  const [homeFontColor, setHomeFontColor] = useState()
  const [container1, setContainer1] = useState()
  const [container1BgColor, setContainer1BgColor] = useState()
  const [container2, setContainer2] = useState()
  const [container2BgColor, setContainer2BgColor] = useState()

  const modifyUserModalRef = useRef()
  const [users, setUsers] = useState([])
  const [userInfo, setUserInfo] = useState()

  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [accountType, setAccountType] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  // New Dropdown
  const newDropwDownRef = useRef()
  const newDropDownItemRef = useRef()
  const [newDropDownName, setNewDropDownName] = useState()
  const [newDropDownItem, setNewDropDownItem] = useState()

  const saveSettings = () => {
    const data = {
      id: settingsID,
      loginBgColor,
      loginTitle,
      appTitle,
      homeBgColor,
      homeFontColor,
      containerTitle1: container1,
      container1BgColor,
      containerTitle2: container2,
      container2BgColor
    }
    ipcRenderer.send('new-setting', data)
  }

  const updateUserInfo = (id) => {
    const newUserData = {
      id,
      name: user,
      pwd: pass,
      accountType
    }
    ipcRenderer.send('updateUserInfo', newUserData)
  }

  const deleteUser = (id) => {
    ipcRenderer.send('delete-user', id)
  }

  useEffect(() => {
    setsettingsID(settingInfo?._id)
    setLoginTitle(settingInfo?.loginTitle)
    setLoginBgColor(settingInfo?.loginBgColor)
    setAppTitle(settingInfo?.appTitle)
    setHomeBgColor(settingInfo?.homeBgColor)
    setHomeFontColor(settingInfo?.homeFontColor)
    setContainer1(settingInfo?.containerTitle1)
    setContainer1BgColor(settingInfo?.container1BgColor)
    setContainer2(settingInfo?.containerTitle2)
    setContainer2BgColor(settingInfo?.container2BgColor)
  }, [])

  useEffect(() => {
    ipcRenderer.send('get-users')

    ipcRenderer.on('all-users', (e, args) => {
      const users = JSON.parse(args)
      setUsers(users)
    })

    ipcRenderer.on('dropdown-added', (e, args) => {
      toast.success(args, { position: 'top-center', containerId: 'settingsNofication' })

      ipcRenderer.send('getting-dropdown')
      setNewDropDownName('')
      newDropwDownRef.current.close()
    })

    ipcRenderer.on('updated-user', (e, args) => {
      toast.success(args, { position: 'top-center', containerId: 'settingsNofication' })

      ipcRenderer.send('get-users')

      modifyUserModalRef.current.close()
    })

    ipcRenderer.on('deleted-user', (e, args) => {
      toast.success(args, { position: 'top-center', containerId: 'settingsNofication' })

      ipcRenderer.send('get-users')

      modifyUserModalRef.current.close()
    })

    // Settings

    ipcRenderer.on('settings-saved', (e, args) => {
      console.log('new setting saved.')
      toast.success(`Setting saved. App will restart to apply changes.`, {
        position: 'top-center',
        containerId: 'settingsNofication'
      })

      setTimeout(() => {
        ipcRenderer.send('settings-saved')
      }, 2000)
    })

    ipcRenderer.on('new-user-saved', (e, args) => {
      toast.success(args, { position: 'bottom-right', containerId: 'settingsNofication' })

      ipcRenderer.send('get-users')

      setNewUserName('')
      setNewUserPass('')
      setNewUserAccountType('')

      newUserFormRef.current.close()
    })

    ipcRenderer.on('dropdown-item-added', (e, args) => {
      // ipcRenderer.send('getting-dropdown')
      toast.success('Treatment item added.', {
        position: 'top-center',
        containerId: 'settingsNofication'
      })

      ipcRenderer.send('get-treatment-items', args)

      newDropDownItemRef.current.close()
      setNewDropDownItem('')
    })

    ipcRenderer.on('treatment-item-deleted', (e, args) => {
      toast.success('Treatment item deleted.', {
        position: 'top-center',
        containerId: 'settingsNofication'
      })

      ipcRenderer.send('get-treatment-items', args)
    })

    ipcRenderer.on('treatement-data-deleted', (e, args) => {
      toast.success(args, {
        position: 'top-center',
        containerId: 'settingsNofication'
      })

      ipcRenderer.send('getting-dropdown')
    })
  }, [])

  return (
    <>
      <dialog
        ref={settingModalRef}
        style={{ position: 'relative', zIndex: 9999999, width: '100%', height: '100%' }}
      >
        <Box sx={{ width: '100%' }}>
          <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} p={1}>
            <Typography variant="h4">Settings</Typography>

            <Button
              variant="contained"
              color="error"
              onClick={() => settingModalRef.current.close()}
            >
              Close
            </Button>
          </Stack>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
            >
              <Tab label="Personalization" {...a11yProps(0)} />
              <Tab label="Users" {...a11yProps(1)} />
              <Tab label="Dropdown Values" {...a11yProps(2)} />
              <Tab label="Product Inventory" {...a11yProps(3)} />
            </Tabs>
          </Box>

          {/* Tab 1 */}
          <CustomTabPanel tabValue={tabValue} index={0}>
            <Grid item xs={7}>
              <Typography variant="h4" m={1}>
                Application Customize
              </Typography>

              <Stack
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'space-between'}
                mt={1}
              >
                <Stack flexDirection={'row'} justifyContent={'space-between'} width={'100%'}>
                  <TextField
                    fullWidth
                    label="Login Title"
                    value={loginTitle}
                    onChange={(e) => setLoginTitle(e.target.value)}
                    sx={{ m: 1 }}
                  />

                  <TextField
                    type="color"
                    sx={{ m: 1 }}
                    fullWidth
                    label="Login Background Color"
                    value={loginBgColor}
                    onChange={(e) => {
                      setLoginBgColor(e.target.value)
                    }}
                  />
                </Stack>

                <Stack flexDirection={'row'} justifyContent={'space-between'} width={'100%'} mt={1}>
                  <TextField
                    sx={{ m: 1 }}
                    fullWidth
                    label="App Title"
                    value={appTitle}
                    onChange={(e) => setAppTitle(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    type="color"
                    sx={{ m: 1 }}
                    fullWidth
                    label="Home Background Color"
                    value={homeBgColor}
                    onChange={(e) => setHomeBgColor(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    type="color"
                    sx={{ m: 1 }}
                    fullWidth
                    label="Font Color"
                    value={homeFontColor}
                    onChange={(e) => setHomeFontColor(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>

                <Stack flexDirection={'row'} justifyContent={'space-between'} width={'100%'} mt={1}>
                  <TextField
                    sx={{ m: 1 }}
                    fullWidth
                    label="Container 1 Title"
                    value={container1}
                    onChange={(e) => setContainer1(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    type="color"
                    sx={{ m: 1 }}
                    fullWidth
                    label="Container 1 Background Color"
                    value={container1BgColor}
                    onChange={(e) => setContainer1BgColor(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>

                <Stack flexDirection={'row'} justifyContent={'space-between'} width={'100%'} mt={3}>
                  <TextField
                    sx={{ m: 1 }}
                    fullWidth
                    label="Container 2 Title"
                    value={container2}
                    onChange={(e) => setContainer2(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    type="color"
                    sx={{ m: 1 }}
                    fullWidth
                    label="Container 2 Background Color"
                    value={container2BgColor}
                    onChange={(e) => setContainer2BgColor(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
              </Stack>

              <Stack flexDirection={'row'} justifyContent={'end'} m={2}>
                <Button variant="contained" color="warning" size="large" onClick={saveSettings}>
                  Save settings (App will restart)
                </Button>
              </Stack>
            </Grid>
          </CustomTabPanel>

          {/* Tab 2 */}
          <CustomTabPanel tabValue={tabValue} index={1}>
            <Stack flexDirection={'row'} justifyContent={'space-between'} p={1}>
              <Typography variant="h5">All Users</Typography>
              <Button
                size="small"
                variant="contained"
                color="info"
                onClick={() => newUserFormRef.current.showModal()}
              >
                Add User
              </Button>
            </Stack>
            <Paper
              className="scrollable-div"
              sx={{
                padding: 0.5,
                overflow: 'auto',
                height: 500,
                background: 'rgba(50,200,150, 0.5)'
              }}
            >
              {users.map((user) => (
                <Card
                  key={user._id}
                  sx={{
                    mb: 1,
                    cursor: 'pointer',
                    transition: 'all 0.1s',
                    '&:hover': {
                      boxShadow: '4px 4px 8px 4px rgba(20,50,80,5)',
                      marginLeft: 1
                    }
                  }}
                  onClick={() => {
                    setUserInfo(user)

                    setUser(user.name)
                    setPass(user.pwd)
                    setAccountType(user.accountType)

                    modifyUserModalRef.current.showModal()
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">Username: {user.name}</Typography>
                    <Typography variant="h6">Account type: {user.accountType}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Paper>
          </CustomTabPanel>

          {/* Tab 3 */}
          <CustomTabPanel tabValue={tabValue} index={2}>
            <Box sx={{ padding: 1, mt: 2 }}>
              <Typography variant="h4">Drop down Values</Typography>

              <Stack flexDirection={'row'}>
                <Grid container sx={{ backgroundColor: 'rgba(190,120,110, .5)' }}>
                  <Grid item xs={6} sx={{ padding: 2, borderRight: '1px solid indigo' }}>
                    <Stack
                      flexDirection={'row'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                    >
                      <Typography variant="h6">Treatments</Typography>
                      <Button
                        variant="contained"
                        onClick={() => newDropwDownRef.current.showModal()}
                      >
                        New
                      </Button>
                    </Stack>

                    <Stack
                      flexDirection={'row'}
                      alignItems={'start'}
                      justifyContent={'space-between'}
                      mt={2}
                      sx={{ background: 'whitesmoke', padding: 2, borderRadius: '1rem' }}
                    >
                      <FormControl fullWidth sx={{ position: 'relative', zIndex: 2, mr: 2 }}>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          native
                          sx={{ position: 'relative', zIndex: 2 }}
                          value={selectedTreatment}
                          onChange={(e) => setSelectedTreatment(e.target.value)}
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
                        <FormHelperText>Treatment Rendered Options</FormHelperText>
                      </FormControl>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          console.log(selectedTreatment)
                          ipcRenderer.send('delete-treatment-data', selectedTreatment)
                        }}
                      >
                        Delete Treatment
                      </Button>
                    </Stack>
                  </Grid>

                  <Grid item xs={6} sx={{ padding: 2 }}>
                    <Stack
                      flexDirection={'row'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                    >
                      <Typography variant="h6">Treatments Types</Typography>
                      <Button
                        variant="contained"
                        onClick={() => newDropDownItemRef.current.showModal()}
                      >
                        New
                      </Button>
                    </Stack>

                    <Stack
                      flexDirection={'row'}
                      alignItems={'start'}
                      justifyContent={'space-between'}
                      mt={2}
                      sx={{ background: 'whitesmoke', padding: 2, borderRadius: '1rem' }}
                    >
                      <FormControl fullWidth sx={{ position: 'relative', zIndex: 2, mr: 2 }}>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          native
                          sx={{ position: 'relative', zIndex: 2 }}
                          value={selectedTreatmentItem}
                          onChange={(e) => {
                            setSelectedTreatmentItem(e.target.value)
                          }}
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
                        <FormHelperText>Treatment Types Options</FormHelperText>
                      </FormControl>

                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          console.log(selectedTreatment, selectedTreatmentItem)
                          ipcRenderer.send('delete-treatment-item', {
                            ref: selectedTreatment,
                            itemName: selectedTreatmentItem
                          })
                        }}
                      >
                        Delete Item
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Box>
          </CustomTabPanel>

          <CustomTabPanel tabValue={tabValue} index={3}>
            <Box
              sx={{ padding: 1, mt: 2 }}
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Typography variant="h6">Manage your clinic item or products</Typography>

              <Box sx={{ background: 'lightgrey', padding: 10 }}>
                <Typography variant="body" textAlign={'center'}>
                  Features coming soon...
                </Typography>
              </Box>
            </Box>
          </CustomTabPanel>
        </Box>
        <ToastContainer
          autoClose={2000}
          pauseOnFocusLoss={false}
          pauseOnHover={false}
          enableMultiContainer
          containerId={'settingsNofication'}
        />
      </dialog>

      <dialog ref={newDropwDownRef} style={{ padding: 20 }}>
        <Typography variant="h6" textAlign={'center'}>
          New Treatment
        </Typography>

        <Stack mt={2}>
          <TextField
            label="Treatment Name"
            value={newDropDownName}
            onChange={(e) => setNewDropDownName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            onClick={() => {
              ipcRenderer.send('new-dropdown', newDropDownName)
            }}
          >
            Save
          </Button>
        </Stack>
      </dialog>

      <dialog ref={newDropDownItemRef} style={{ padding: 20 }}>
        <Typography variant="h6" textAlign={'center'}>
          Treatment Item
        </Typography>

        <Stack mt={2}>
          <TextField
            label="Treatment Item"
            value={newDropDownItem}
            onChange={(e) => setNewDropDownItem(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            onClick={() => {
              ipcRenderer.send('new-dropdown-item', {
                itemName: newDropDownItem,
                ref: selectedTreatment
              })
            }}
          >
            Save
          </Button>
        </Stack>
      </dialog>

      <dialog ref={modifyUserModalRef} style={{ padding: 20, margin: 1, width: 500 }}>
        <Stack flexDirection={'row'} justifyContent={'space-between'}>
          <Typography variant="h5">Modify User : {userInfo?.name}</Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => modifyUserModalRef.current.close()}
          >
            Close
          </Button>
        </Stack>

        <Stack flexDirection={'row'} alignItems={'center'}>
          <TextField
            type="text"
            label="Username"
            helperText="User"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />

          <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    // onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>Account Type</FormHelperText>
          </FormControl>
        </Stack>
        <FormControl fullWidth sx={{ position: 'relative', zIndex: 2 }}>
          <Select
            onChange={(e) => setAccountType(e.target.value)}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={accountType}
            native
            sx={{ position: 'relative', zIndex: 2, width: 200 }}
            fullWidth
          >
            {/* <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem> */}

            <option value={'admin'}>Admin</option>
            <option value={'user'}>User</option>
          </Select>

          <FormHelperText>Account Type</FormHelperText>
        </FormControl>

        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'flex-end'} gap={2}>
          <Button variant="contained" color="info" onClick={() => updateUserInfo(userInfo._id)}>
            Save
            <Save sx={{ p: 1 }} />
          </Button>
          <Button variant="contained" color="error" onClick={() => deleteUser(userInfo._id)}>
            Delete
            <DeleteForever sx={{ p: 1 }} />
          </Button>
        </Stack>
      </dialog>

      {/* New user */}

      <dialog ref={newUserFormRef} style={{ padding: 10, width: 500 }}>
        <Stack flexDirection={'row'} justifyContent={'space-between'} mb={1}>
          <Typography variant="h4">New User form</Typography>
          <Button variant="contained" color="error" onClick={() => newUserFormRef.current.close()}>
            Cancel
          </Button>
        </Stack>

        <Stack mb={1}>
          <TextField
            type="text"
            label="User"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            sx={{ mb: 1 }}
          />
          <TextField
            sx={{ mb: 1 }}
            type="password"
            label="Password"
            value={newUserPass}
            onChange={(e) => setNewUserPass(e.target.value)}
          />

          <FormControl fullWidth sx={{ position: 'relative', zIndex: 2, mb: 1 }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              native
              sx={{ position: 'relative', zIndex: 2, width: 200 }}
              value={newUserAccountType}
              onChange={(e) => setNewUserAccountType(e.target.value)}
            >
              <option value={'user'}>USER</option>
              <option value={'admin'}>ADMIN</option>
            </Select>
            <FormHelperText>Account Type</FormHelperText>
          </FormControl>
        </Stack>

        <Stack mb={1}>
          <Button variant="contained" color="info" onClick={submitNewUser}>
            Submit
          </Button>
        </Stack>
      </dialog>
    </>
  )
}
export default Settings
