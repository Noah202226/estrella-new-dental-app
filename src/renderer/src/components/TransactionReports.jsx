import { CloseOutlined, DatasetLinked } from '@mui/icons-material'
import {
  Button,
  ButtonGroup,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import SalesInfo from './SalesInfo'
import ExpenseInfo from './ExpenseInfo'

const TransactionReports = ({ transactionReportRef, dropdownData }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page2, setPage2] = useState(0)
  const [rowsPerPage2, setRowsPerPage2] = useState(10)

  const [firstDayOfMonth, setFirstDayOfMonth] = useState()
  const [lastDayOfMonth, setLastDayOfMonth] = useState()

  // Get transaction info
  const [txID, setTxID] = useState()

  // Sale Transaction refs
  const saleTransactionRef = useRef()
  const saleTransactionInfoRef = useRef()
  const expenseTransactionRef = useRef()

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  // expense
  const handleChangePageExpense = (event, newPage2) => {
    setPage2(newPage2)
  }

  const handleChangeRowsPerPageExpense = (event) => {
    setRowsPerPage2(+event.target.value)
    setPage2(0)
  }

  const [rows, setRows] = useState([])
  const [filterRows, setfilterRows] = useState([])

  const [expenseRows, setexpenseRows] = useState([])
  const [filterExpenseRows, setfilterExpenseRows] = useState([])

  // Date
  const getFirstAndLastDayOfMonth = () => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1 // Adding 1 since getMonth() returns zero-based month

    // Formatting the first day of the month
    const firstDay = `${year}-${month.toString().padStart(2, '0')}-01`

    // Calculating the last day of the month
    const lastDay = `${year}-${month.toString().padStart(2, '0')}-${new Date(
      year,
      month,
      0
    ).getDate()}`

    return { firstDay, lastDay }
  }

  const { firstDay, lastDay } = getFirstAndLastDayOfMonth()

  const getDataRange = () => {
    // setGoFilter(!goFilter)

    console.log(firstDay, lastDay)
    console.log(firstDayOfMonth, lastDayOfMonth)
    ipcRenderer.send('get-filtered-sales-record', {
      firstDay: firstDayOfMonth,
      lastDay: lastDayOfMonth
    })
    ipcRenderer.send('get-filtered-expenses-record', {
      firstDay: firstDayOfMonth,
      lastDay: lastDayOfMonth
    })
  }

  useEffect(() => {
    // Getting sales and expenses
    ipcRenderer.send('get-filtered-sales-record', { firstDay, lastDay })
    ipcRenderer.send('get-filtered-expenses-record', { firstDay, lastDay })

    setFirstDayOfMonth(firstDay)
    setLastDayOfMonth(lastDay)

    ipcRenderer.on('filted-sales', (e, args) => {
      const txs = JSON.parse(args)
      console.log(txs)
      setRows(txs)
      setfilterRows(txs)
    })
    ipcRenderer.on('filted-expenses', (e, args) => {
      const txs = JSON.parse(args)
      console.log(txs)
      setexpenseRows(txs)
      setfilterExpenseRows(txs)
    })
  }, [])
  return (
    <dialog
      ref={transactionReportRef}
      style={{ position: 'relative', zIndex: 9999999, width: '100%', height: '100%' }}
    >
      <Stack flexDirection={'row'} justifyContent={'space-between'}>
        <Typography variant="h4" color={'indigo'} sx={{ textShadow: '2px 2px 2px cyan' }}>
          Transaction Reports
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={() => transactionReportRef.current.close()}
        >
          <CloseOutlined />
          (ESC)
        </Button>
      </Stack>

      <Stack
        flexDirection={'row'}
        justifyContent={'space-between'}
        mt={1}
        bgcolor={'lightblue'}
        p={2}
      >
        <Stack
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          width={600}
        >
          <Typography variant="h6">Date range:</Typography>
          <TextField
            type="date"
            value={firstDayOfMonth}
            onChange={(e) => setFirstDayOfMonth(e.target.value)}
            size="small"
          />
          <TextField
            type="date"
            size="small"
            value={lastDayOfMonth}
            onChange={(e) => setLastDayOfMonth(e.target.value)}
          />
          <Button variant="contained" onClick={getDataRange}>
            Get Data
            <DatasetLinked />
          </Button>
        </Stack>

        <Stack>
          {/* <ExportToExcelButton sales={filterRows} expenses={filterExpenseRows} /> */}
          {/* 
          <ExcelJSButton
            sales={filterRows}
            expenses={filterExpenseRows}
            firstDay={firstDayOfMonth}
            lastDay={lastDayOfMonth}
          /> */}
        </Stack>
      </Stack>

      <Grid container spacing={0.5}>
        <Grid item xs={7}>
          <TableContainer
            component={Paper}
            sx={{ mt: 1, height: '100%', backgroundColor: 'rgba(20,220,40, .2)' }}
          >
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Patient Name</TableCell>
                  <TableCell align="right">Treatment Rendered</TableCell>
                  <TableCell align="right">Treatment Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filterRows
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      onClick={() => {
                        saleTransactionInfoRef.current.showModal()
                        setTxID(row._id)
                      }}
                      key={row._id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': { background: 'rgba(10,10,60,0.2)', color: 'whitesmoke' }
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {new Date(row?.dateTransact).toLocaleString(undefined, {
                          // year: '2-digit',
                          // month: '2-digit',
                          // day: '2-digit',
                          dateStyle: 'short'
                        })}
                      </TableCell>
                      <TableCell align="center" className="capitalize">
                        {row.patientName}
                      </TableCell>
                      <TableCell align="right" className="capitalize">
                        {row.treatmentRendered}
                      </TableCell>
                      <TableCell align="right" className="capitalize">
                        {row.treatmentType}
                      </TableCell>
                      <TableCell align="right">{row.amountPaid}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <caption style={{ captionSide: 'top' }}>
                <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                  <Typography>SALES</Typography>

                  <ButtonGroup size="small" variant="text">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setfilterRows(rows)
                      }}
                    >
                      All
                    </Button>

                    {dropdownData.map((dropdown) => (
                      <Button
                        key={dropdown?._id}
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setfilterRows(rows)
                          setfilterRows((prev) =>
                            prev.filter((sale) => sale.treatmentRendered === dropdown?.itemName)
                          )
                        }}
                      >
                        {dropdown?.itemName}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Stack>
              </caption>
              <caption style={{ captionSide: 'bottom', textAlign: 'end', fontSize: 18 }}>
                <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                  <Typography>No. of transaction: {filterRows.length}</Typography>
                  <Typography>
                    Total Amount: {filterRows.reduce((a, b) => a + b.amountPaid, 0)}
                  </Typography>
                </Stack>
              </caption>
            </Table>

            <TablePagination
              rowsPerPageOptions={[-1]}
              component="div"
              count={filterRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage=""
              showFirstButton={true}
              showLastButton={true}
            />
          </TableContainer>
        </Grid>

        {/* Expenses */}
        <Grid item xs={5}>
          <TableContainer
            component={Paper}
            sx={{ mt: 1, height: '100%', backgroundColor: 'lightblue' }}
          >
            <Table sx={{ minWidth: 50, width: '95%' }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Expense Name</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filterExpenseRows
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      onClick={() => {
                        expenseTransactionRef.current.showModal()
                        setTxID(row._id)
                      }}
                      key={row._id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': { background: 'rgba(10,10,60,0.2)', color: 'whitesmoke' }
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {new Date(row?.dateExpense).toLocaleString(undefined, {
                          // year: '2-digit',
                          // month: '2-digit',
                          // day: '2-digit',
                          dateStyle: 'short'
                        })}
                      </TableCell>
                      <TableCell align="center">{row.expenseName}</TableCell>
                      <TableCell align="right">{row.amount}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <caption style={{ captionSide: 'top' }}>
                <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                  <Typography>EXPENSES</Typography>

                  <ButtonGroup size="small" variant="text">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setfilterExpenseRows(expenseRows)
                      }}
                    >
                      All
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setfilterExpenseRows(expenseRows)
                        setfilterExpenseRows((prev) =>
                          prev.filter((sale) => sale.expenseName === 'Meralco')
                        )
                      }}
                    >
                      Meralco
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setfilterExpenseRows(expenseRows)
                        setfilterExpenseRows((prev) =>
                          prev.filter((sale) => sale.expenseName === 'Internet')
                        )
                      }}
                    >
                      Internet
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setfilterExpenseRows(expenseRows)
                        setfilterExpenseRows((prev) =>
                          prev.filter((sale) => sale.expenseName === 'Prime Water')
                        )
                      }}
                    >
                      Prime Water
                    </Button>
                  </ButtonGroup>
                </Stack>
              </caption>
              <caption style={{ captionSide: 'bottom', textAlign: 'end', fontSize: 18 }}>
                <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                  <Typography>No. of transaction: {filterExpenseRows.length}</Typography>
                  <Typography>
                    Total Amount: {filterExpenseRows.reduce((a, b) => a + b.amount, 0)}
                  </Typography>
                </Stack>
              </caption>
            </Table>

            <TablePagination
              rowsPerPageOptions={[1]}
              component="div"
              count={filterExpenseRows.length}
              rowsPerPage={rowsPerPage2}
              page={page2}
              onPageChange={handleChangePageExpense}
              onRowsPerPageChange={handleChangeRowsPerPageExpense}
              labelRowsPerPage=""
              showFirstButton={true}
              showLastButton={true}
            />
          </TableContainer>
        </Grid>
      </Grid>

      <SalesInfo
        saleTransactionRef={saleTransactionInfoRef}
        txID={txID}
        firstDay={firstDay}
        lastDay={lastDay}
      />

      <ExpenseInfo
        expenseTransactionRef={expenseTransactionRef}
        txID={txID}
        firstDay={firstDay}
        lastDay={lastDay}
      />

      <ToastContainer
        autoClose={2000}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        enableMultiContainer
        containerId={'transactionsNofity'}
      />
    </dialog>
  )
}

export default TransactionReports
