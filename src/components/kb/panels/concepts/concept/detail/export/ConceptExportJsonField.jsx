import { Box, Checkbox, Typography } from '@mui/material'

import { ALWAYS_INCLUDED_FIELDS } from './useConceptData'

const controlSx = { width: 28, display: 'flex', justifyContent: 'center', alignItems: 'center' }
const fieldSx = { display: 'grid', gridTemplateColumns: '28px 1fr', alignItems: 'center' }

const ConceptExportJsonField = ({ checked, field, onChange }) => {
  const isDisabled = ALWAYS_INCLUDED_FIELDS.includes(field)
  return (
    <Box sx={fieldSx}>
      <Box sx={controlSx}>
        <Checkbox checked={checked} disabled={isDisabled} onChange={onChange} size='small' sx={{ p: 0 }} />
      </Box>
      <Typography sx={{ pl: 0.5 }}>{field}</Typography>
    </Box>
  )
}

export default ConceptExportJsonField