import { Button, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

const ExpenseInfo = ({ expenseTransactionRef, txID, firstDay, lastDay }) => {
  const ipcRenderer = window.ipcRenderer

  const [expenseName, setExpenseName] = useState()
  const [expenseDate, setExpenseDate] = useState()
  const [expenseAmount, setExpenseAmount] = useState()

  const deleteTx = () => {
    ipcRenderer.send('delete-expense-tx', txID)
  }

  const udpateTx = () => {
    const newData = {
      expenseName,
      dateExpense: expenseDate,
      amount: expenseAmount
    }
    ipcRenderer.send('update-expense-tx', { txID, newData })
  }

  useEffect(() => {
    if (txID) {
      ipcRenderer.send('get-expense-tx-info', txID)

      ipcRenderer.on('expense-tx-info', (e, args) => {
        const tx = JSON.parse(args)

        setExpenseName(tx.expenseName)
        setExpenseAmount(tx.amount)

        const year = new Date(tx.dateExpense).getFullYear()
        const month = (new Date(tx.dateExpense).getMonth() + 1).toString().padStart(2, '0')
        const day = new Date(tx.dateExpense).getDate().toString().padStart(2, '0')

        const formattedDate = `${year}-${month}-${day}`
        setExpenseDate(formattedDate)
      })

      ipcRenderer.on('expense-tx-deleted', (e, args) => {
        toast.success(args, { position: 'top-center', containerId: 'transactionsNofity' })

        ipcRenderer.send('get-filtered-sales-record', { firstDay, lastDay })
        ipcRenderer.send('get-filtered-expenses-record', { firstDay, lastDay })

        expenseTransactionRef.current.close()
      })

      ipcRenderer.on('expense-tx-updated', (e, args) => {
        toast.success(args, { position: 'top-center', containerId: 'transactionsNofity' })

        ipcRenderer.send('get-filtered-sales-record', { firstDay, lastDay })
        ipcRenderer.send('get-filtered-expenses-record', { firstDay, lastDay })

        expenseTransactionRef.current.close()
      })
    }
  }, [txID])

  return (
    <dialog ref={expenseTransactionRef} style={{ padding: 10 }}>
      <Stack flexDirection={'row'} justifyContent={'space-between'}>
        <Typography variant="h6">Expense transaction info</Typography>
        <Button
          color="error"
          variant="contained"
          onClick={() => expenseTransactionRef.current.close()}
        >
          Close
        </Button>
      </Stack>

      <TextField
        type="text"
        label="Expense Name"
        value={expenseName}
        onChange={(e) => setExpenseName(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        type="date"
        label="Date"
        value={expenseDate}
        InputLabelProps={{ shrink: true }}
        onChange={(e) => setExpenseDate(e.target.value)}
      />
      <TextField
        type="number"
        label="Amount"
        value={expenseAmount}
        InputLabelProps={{ shrink: true }}
        onChange={(e) => setExpenseAmount(e.target.value)}
      />

      <Stack flexDirection={'row'}>
        <Button variant="contained" onClick={udpateTx}>
          Update
        </Button>
        <Button variant="contained" color="error" onClick={deleteTx}>
          Delete
        </Button>
      </Stack>
    </dialog>
  )
}

export default ExpenseInfo
