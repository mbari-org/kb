import { useTheme } from '@mui/material/styles'

const useInputStyle = () => {
  const theme = useTheme()

  return {
    fullWidth: true,
    margin: 'normal',
    size: 'small',
    sx: {
      '& .MuiInputBase-input': {
        backgroundColor: theme.palette.background.paper,
        color: '#000',
        WebkitTextFillColor: '#000',
      },
    },
    variant: 'outlined',
  }
}

export default useInputStyle
