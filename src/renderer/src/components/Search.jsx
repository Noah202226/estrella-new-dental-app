import { TextField } from '@mui/material'
import Input from '@mui/base/Input'
import { styled } from '@mui/system'
import React from 'react'

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75'
}

const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f'
}

const StyledInputElement = styled('input')(
  ({ theme }) => `
  width: 500px;
  font-family: 'Arial Rounded MT', San serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  border-radius: 12px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: .5px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 8px ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
)

const Search = ({ search, setsearch }) => {
  return (
    <>
      <Input
        className="capitalize"
        slots={{ input: StyledInputElement }}
        type="search"
        placeholder="Search Patient here..."
        value={search}
        onChange={(e) => setsearch(e.target.value)}
      />
    </>
  )
}

export default Search
