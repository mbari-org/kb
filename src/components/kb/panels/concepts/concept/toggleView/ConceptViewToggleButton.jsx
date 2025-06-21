import ToggleButton from '@mui/material/ToggleButton'

import { useTheme } from '@mui/material/styles'

const ConceptViewToggleButton = ({ Icon, value }) => {
  const theme = useTheme()

  return (
    <ToggleButton
      value={value}
      aria-label={value}
      sx={{
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.grey[200],
        '&.Mui-selected': {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
        },
        '&:hover': {
          backgroundColor: theme.palette.grey[800],
          color: theme.palette.grey[200],
        },
        '&.Mui-selected:hover': {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
        },
      }}
    >
      <Icon />
    </ToggleButton>
  )
}

export default ConceptViewToggleButton
