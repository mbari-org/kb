import { forwardRef } from 'react'
import { TextField, useTheme } from '@mui/material'

const LoginInput = forwardRef(
  (
    { id, label, name, type = 'text', required = true, fullWidth = true, sx = {}, ...props },
    ref
  ) => {
    const theme = useTheme()

    // This styling is needed since browsers detect username and password fields and set background
    // color to a light blue.
    const baseSx = {
      '& .MuiInputBase-input': {
        backgroundColor: theme.palette.grey[300],
        WebkitTextFillColor: '#000',
        '&:-webkit-autofill': {
          WebkitBoxShadow: `0 0 0 1000px ${theme.palette.grey[300]} inset`,
          WebkitTextFillColor: '#000',
        },
      },
      ...sx,
    }

    return (
      <TextField
        fullWidth={fullWidth}
        id={id}
        inputRef={ref}
        label={label}
        name={name}
        required={required}
        sx={baseSx}
        type={type}
        {...props}
      />
    )
  }
)

LoginInput.displayName = 'LoginInput'

export default LoginInput
