import { Box, Typography } from '@mui/material'

import RealizationDetail from './RealizationDetail'
import RealizationReset from './reset/RealizationReset'

import { actionVerb } from '@/components/kb/panels/concepts/concept/change/action'
import { fieldSx } from '@/components/common/format'

const RealizationEdit = ({ realizationEdit, disabled, initial }) => {
  const { action, index, updates } = realizationEdit

  const actionText = actionVerb(action)
  const realizationName = initial?.name || updates?.name

  const realizationSx = disabled ? { ...fieldSx, color: 'text.disabled' } : fieldSx

  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        mt: 0.5,
      }}
    >
      <Box sx={{ alignItems: 'center', display: 'flex' }}>
        <RealizationReset index={index} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={realizationSx}>{actionText}:</Typography>
          <Typography sx={{ ...realizationSx, fontWeight: 'bold', ml: 1 }}>{realizationName}</Typography>
        </Box>
      </Box>
      <RealizationDetail action={action} disabled={disabled} initial={initial} updates={updates} />
    </Box>
  )
}

export default RealizationEdit
