import ToggleButton from '@mui/material/ToggleButton'

import { useTheme } from '@mui/material/styles'

const ConceptViewToggleButton = ({ Icon, value, sx }) => {
  const theme = useTheme()

  return (
    <ToggleButton value={value} aria-label={value} sx={{ ...theme.toggleButton, ...sx }}>
      <Icon />
    </ToggleButton>
  )
}

export default ConceptViewToggleButton
