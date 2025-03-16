import { Box, Typography } from '@mui/material'

import AliasDetail from './AliasDetail'
import AliasReset from './AliasReset'

import { fieldSx } from '@/components/common/format'

const AliasEdit = ({ aliasEdit, initial }) => {
  const { action, index, updates } = aliasEdit

  const actionText = `${action.split(' ').pop()}`
  const aliasName = initial?.name || updates?.name

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
        <AliasReset index={index} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={fieldSx}>{actionText}:</Typography>
          <Typography sx={{ ...fieldSx, fontWeight: 'bold', ml: 1 }}>{aliasName}</Typography>
        </Box>
      </Box>
      <AliasDetail action={action} initial={initial} updates={updates} />
    </Box>
  )
}

export default AliasEdit
