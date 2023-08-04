import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  name: { type: String, required: true },
  pass: { type: String, required: true }
})

const InstallmentPatientSchema = new Schema({
  patientRef: String,
  patientName: String,
  patientAge: Number,
  patientAddress: String,
  treatmentRendered: String,
  servicePrice: Number,

  initialPay: Number,
  dateTransact: Date,
  gives: [Object],
  remainingBal: Number,
  treatmentType: String
})

const newPatientSchema = new Schema({
  dateTransact: { type: Date, required: true },
  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  patientGender: { type: String, required: true },
  placeOfBirth: { type: String, required: true },
  nationality: { type: String, required: true },
  civilStatus: { type: String, required: true },
  occupation: { type: String, required: true },
  homeAddress: { type: String, required: true },
  contactNumber1: { type: Number, required: true },
  personToContact: { type: String, required: true },
  personRelation: { type: String, required: true },
  personContactNumber: { type: String, required: true },
  medicalAndDentalHistory: { type: String, required: true }
})

const salesRecordSchema = new Schema({
  patientName: { type: String, required: true },
  dateTransact: { type: Date, required: true },
  treatmentRendered: { type: String, required: true },
  treatmentType: { type: String, required: true },
  amountPaid: { type: Number, required: true }
})

const settingSchema = new Schema({
  ref: { type: String, required: true },
  appTitle: { type: String, required: true },
  backgroundColor: { type: String, required: true },
  fontColor: { type: String, required: true },
  navBgColor: { type: String, required: true },
  navColor: { type: String, required: true },
  appLogo: { type: String, required: true },
  fontSize: { type: Number, required: true },

  newExpenseTitle: String,
  newExpenseBg: String,
  newExpenseFormContainerColor: String,
  newExpenseColor: String,
  newExpenseFontSize: Number,

  newPatientTitle: String,
  newPatientLabelFontSize: Number,
  newPatientBodyBg: String,
  newPatientFormContainerBg: String,

  newPatientRecordLabelFontSize: Number,
  newPatientRecordBodyBg: String,
  newPatientRecordFormContainerColor: String,
  newPatientRecordSalesInfoBg: String,

  patientInfoFontSize: Number,
  patientInfoBodyBg: String,
  patientInfoFormContainerBg: String,
  patientInfoSalesInfoBg: String
})

const expenseSchema = new Schema({
  expenseName: { type: String, required: true },
  amount: { type: Number, required: true },
  dateExpense: { type: Date, required: true }
})

const DropdownSchema = new Schema({
  itemName: String,
  ref: String
})
const DropdownItem = new Schema({
  itemName: String,
  ref: String
})

const Expenses = model('Expense', expenseSchema)
const Users = model('User', userSchema)
const Settings = model('setting', settingSchema)
const SalesRecord = model('SalesRecord', salesRecordSchema)
const PatientRecord = model('PatientRecord', newPatientSchema)
const InstallmentPatient = model('bracepatients', InstallmentPatientSchema)
const Dropdown = model('dropdown', DropdownSchema)
const DropdownData = model('dropdown-item', DropdownItem)

export {
  InstallmentPatient,
  Users,
  PatientRecord,
  SalesRecord,
  Settings,
  Expenses,
  Dropdown,
  DropdownData
}
