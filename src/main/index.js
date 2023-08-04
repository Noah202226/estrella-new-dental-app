import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { connectDB } from './db'
import {
  Dropdown,
  DropdownData,
  Expenses,
  InstallmentPatient,
  PatientRecord,
  SalesRecord,
  Users
} from './schemas'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,

    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize()
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  connectDB().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    createWindow()

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('check-user', async (e, args) => {
  const user = await Users.findOne({ name: args.data.user, pass: args.data.password })

  e.reply('login-status', user)
})

ipcMain.on('get-installment-patients', async (e, args) => {
  const patients = await InstallmentPatient.find()

  e.reply('brace-patients', JSON.stringify(patients))
})

// Patient Record
ipcMain.on('get-patients', async (e, args) => {
  const patients = await PatientRecord.find()

  e.reply('patients', JSON.stringify(patients))
})
ipcMain.on('get-patient-record', async (e, args) => {
  const patientData = await PatientRecord.findOne({ _id: args })

  e.reply('patient-record', JSON.stringify(patientData))
})
// New patient
ipcMain.on('new-patient-record', async (e, args) => {
  console.log(args)

  const newPatient = new PatientRecord(args)

  try {
    await newPatient.save()
    // await newPatient2.save()
    console.log('User saved successfully!')
    e.reply('new-patient-record-saved', 'New Patient Record Saved.')
    // Handle any success messages or redirects
  } catch (error) {
    console.error('Error saving user:', error)
    // Handle any error messages or error handling
  }
})
ipcMain.on('update-patient-data', async (e, args) => {
  try {
    const result = await PatientRecord.findOneAndUpdate({ _id: args.idToUpdate }, args.data)

    e.reply('patient-data-updated')
  } catch (e) {
    console.log(e)
    e.reply('patient-data-update-error', e)
  }
})
ipcMain.on('delete-patient-record', async (e, args) => {
  try {
    await PatientRecord.findOneAndDelete({ _id: args })
    e.reply('patient-record-deleted')
  } catch (e) {
    console.log(e)
    e.reply('error-deleting-patient')
  }
})

// Sales
ipcMain.on('get-patient-tx', async (e, args) => {
  console.log(args)
  const txs = await SalesRecord.find({ patientName: args })

  e.reply('patient-txs', JSON.stringify(txs))
})

ipcMain.on('delete-tx', async (e, args) => {
  console.log(args)
  try {
    await SalesRecord.findOneAndDelete({ _id: args })
    e.reply('tx-deleted')
  } catch (e) {
    console.log(e)
    e.reply('error-deleting-tx', e)
  }
})

ipcMain.on('new-sale', async (e, args) => {
  try {
    const newSale = new SalesRecord(args)

    await newSale.save()

    e.reply('new-sale-saved', 'New Sale.')
  } catch (e) {
    console.log(e)
  }
})

// Dropdown
ipcMain.on('getting-dropdown', async (e, args) => {
  const data = await Dropdown.find()

  try {
    e.reply('dropdown-data', JSON.stringify(data))
    console.log('data', data)
  } catch (e) {
    console.log('error getting treatment list', e)
  }
})
ipcMain.on('get-treatment-items', async (e, args) => {
  try {
    const dataItem = await DropdownData.find({ ref: args })

    e.reply('treatment-items', JSON.stringify(dataItem))
  } catch (e) {
    console.log('error getting treatment items', e)
  }
})

ipcMain.on('new-dropdown', async (e, args) => {
  try {
    // const ref = (await Dropdown.find()).length
    const data = new Dropdown({ itemName: args, ref: args })

    await data.save()

    e.reply('dropdown-added', 'New dropdown saved')
  } catch (e) {
    console.log(e)
  }
})
ipcMain.on('new-dropdown-item', async (e, args) => {
  try {
    const data = new DropdownData({ itemName: args.itemName, ref: args.ref })

    await data.save()

    e.reply('dropdown-item-added', args.ref)
  } catch (e) {
    console.log(e)
  }
})

ipcMain.on('delete-treatment-data', async (e, args) => {
  console.log(args)
  try {
    await DropdownData.find().deleteMany({ ref: args })
    await Dropdown.findOneAndDelete({ itemName: args })

    console.log('All data deleted')
    e.reply('treatement-data-deleted', 'Treatment data deleted')
  } catch (e) {
    console.log(e)
  }
})

ipcMain.on('delete-treatment-item', async (e, args) => {
  try {
    await DropdownData.findOneAndDelete({ ref: args.ref, itemName: args.itemName })

    e.reply('treatment-item-deleted', args.ref)
  } catch (e) {
    console.log('error deleting', e)
  }
})

// Get installment patient info
ipcMain.on('get-installment-patient-info', async (e, args) => {
  try {
    const installmentPatientData = await InstallmentPatient.findOne({ _id: args })

    e.reply('installment-patient-info', JSON.stringify(installmentPatientData))
  } catch (error) {
    console.error('Error finding user:', args)
    // Handle any error messages or error handling
  }
})
ipcMain.on('new-installment-patient', async (e, args) => {
  const newInstallmentPatient = new InstallmentPatient(args)

  try {
    await newInstallmentPatient.save()
    // await newPatient2.save()
    console.log('Installment Patient Saved successfully!')
    // Handle any success messages or redirects

    e.reply('installment-patient-saved', 'patient info updated .')
  } catch (error) {
    console.error('Error saving user:', error)
    // Handle any error messages or error handling
  }
})
ipcMain.on('delete-installment-patient', async (e, args) => {
  try {
    await InstallmentPatient.findByIdAndDelete(args)
    // await newPatient2.save()
    console.log('Installment Patient Deleted successfully!')
    // Handle any success messages or redirects

    e.reply('installment-patient-deleted', 'delete now.')
  } catch (error) {
    console.error('Error saving user:', error)
    // Handle any error messages or error handling
  }
})

ipcMain.on('update-installment-patient-gives', async (e, args) => {
  console.log(args)
  try {
    const data = await InstallmentPatient.updateOne(
      { _id: args.patientID },
      {
        $push: { gives: { givenDate: args.givenDate, givenAmount: args.givenAmount } },
        remainingBal: args.remainingBal
      }
    )
    // await newPatient2.save()
    console.log('Installment Patient Give Updated successfully!', data)
    // Handle any success messages or redirects

    e.reply('installment-patient-gives-updated', args.patientID)
  } catch (error) {
    console.error('Error saving user:', error)
    // Handle any error messages or error handling
  }
})

// Transactions Report
ipcMain.on('get-filtered-sales-record', async (e, args) => {
  try {
    const data = await SalesRecord.find({
      dateTransact: { $gte: args.firstDay, $lte: args.lastDay }
    }).sort({ dateTransact: 'desc' })
    // Handle any success messages or redirects
    e.reply('filted-sales', JSON.stringify(data))
  } catch (error) {
    console.error('Error saving user:', error)
    // Handle any error messages or error handling
  }
})
ipcMain.on('get-filtered-expenses-record', async (e, args) => {
  try {
    const data = await Expenses.find({
      dateExpense: { $gte: args.firstDay, $lte: args.lastDay }
    }).sort({ dateExpense: 'asc' })
    // Handle any success messages or redirects
    e.reply('filted-expenses', JSON.stringify(data))
  } catch (error) {
    console.error('Error saving user:', error)
    // Handle any error messages or error handling
  }
})

// Get tx info
ipcMain.on('get-sale-tx-info', async (e, args) => {
  try {
    const data = await SalesRecord.findOne({
      _id: args
    })
    // Handle any success messages or redirects
    e.reply('sale-tx-info', JSON.stringify(data))
  } catch (error) {
    console.error('Error getting tx:', error)
    // Handle any error messages or error handling
  }
})
// Delete tx
ipcMain.on('delete-sale-tx', async (e, args) => {
  try {
    await SalesRecord.findByIdAndDelete({
      _id: args
    })
    // Handle any success messages or redirects
    e.reply('tx-deleted', 'Transaction deleted')
  } catch (error) {
    console.error('Error getting tx:', error)
    // Handle any error messages or error handling
  }
})

ipcMain.on('delete-patient-sale-tx', async (e, args) => {
  console.log(args)
  try {
    await SalesRecord.findByIdAndDelete({
      _id: args.id
    })
    // Handle any success messages or redirects
    e.reply('patient-tx-deleted', { id: args.id, fullName: args.fullName })
  } catch (error) {
    console.error('Error getting tx:', error)
    // Handle any error messages or error handling
  }
})

ipcMain.on('update-sale-tx', async (e, args) => {
  try {
    await SalesRecord.findByIdAndUpdate(args.txID, args.newData)
    // Handle any success messages or redirects
    e.reply('tx-updated', 'Transaction updated')
  } catch (error) {
    console.error('Error getting tx:', error)
    // Handle any error messages or error handling
  }
})

// New Expense
ipcMain.on('new-expense', async (e, args) => {
  const data = new Expenses(args)
  try {
    await data.save()
    // Handle any success messages or redirects
    e.reply('new-expense-saved')
  } catch (error) {
    console.error('Error saving expense:', error)
    // Handle any error messages or error handling
  }
})
ipcMain.on('get-expense-tx-info', async (e, args) => {
  try {
    const data = await Expenses.findOne({
      _id: args
    })
    // Handle any success messages or redirects
    e.reply('expense-tx-info', JSON.stringify(data))
  } catch (error) {
    console.error('Error getting tx:', error)
    // Handle any error messages or error handling
  }
})
// Delete tx
ipcMain.on('delete-expense-tx', async (e, args) => {
  try {
    await Expenses.findByIdAndDelete({
      _id: args
    })
    // Handle any success messages or redirects
    e.reply('expense-tx-deleted', 'Transaction deleted')
  } catch (error) {
    console.error('Error getting tx:', error)
    // Handle any error messages or error handling
  }
})
ipcMain.on('update-expense-tx', async (e, args) => {
  try {
    await Expenses.findByIdAndUpdate(args.txID, args.newData)
    // Handle any success messages or redirects
    e.reply('expense-tx-updated', 'Transaction updated')
  } catch (error) {
    console.error('Error getting tx:', error)
    // Handle any error messages or error handling
  }
})
