import { useTheme } from '@mui/material/styles'
import { Box } from '@mui/material'

import { stagedBorder } from '@/lib/concept/state/staged'

import { asText } from '@/lib/model/realization'

const ConceptTemplate = ({ template }) => {
  const theme = useTheme()

  if (!template) {
    return null
  }

  const border = stagedBorder({
    noActionBorderColor: 'none',
    stagedItem: template,
    theme,
    width: '2px',
  })

  return (
    <Box sx={{ border, pl: 1 }}>
      {asText(template)}
    </Box>
  )
}

export default ConceptTemplate
