import { Box, Typography } from '@mui/material'

import AliasDetail from './AliasDetail'
import AliasReset from './AliasReset'

import { fieldSx } from '@/components/common/format'

import { RESETTING } from '@/lib/constants'

const AliasEdit = ({ aliasEdit, initial, resetting }) => {
  const { action, index, updates } = aliasEdit

  const actionText = `${action.split(' ').pop()}`
  const aliasName = initial?.name || updates?.name

  const aliasSx = resetting === RESETTING.OTHER ? { ...fieldSx, color: 'text.disabled' } : fieldSx

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
          <Typography sx={aliasSx}>{actionText}:</Typography>
          <Typography sx={{ ...aliasSx, fontWeight: 'bold', ml: 1 }}>{aliasName}</Typography>
        </Box>
      </Box>
      <AliasDetail action={action} initial={initial} changing={resetting} updates={updates} />
    </Box>
  )
}

export default AliasEdit
