import ToggleButton from '@mui/material/ToggleButton'
import { useTheme } from '@mui/material/styles'

const HistoryToggleButton = ({ value }) => {
  const theme = useTheme()

  const backgroundColor = theme.palette.grey[800]

  return (
    <ToggleButton
      value={value}
      aria-label={value}
      sx={{
        backgroundColor: backgroundColor,
        color: theme.selector.inactive,
        '&.Mui-selected': {
          backgroundColor: theme.palette.primary.main,
          color: theme.selector.active,
        },
        '&:hover': {
          backgroundColor: backgroundColor,
          color: theme.selector.hover,
        },
        '&.Mui-selected:hover': {
          backgroundColor: theme.palette.primary.main,
          color: theme.selector.active,
        },
      }}
    >
      {value}
    </ToggleButton>
  )
}

export default HistoryToggleButton
