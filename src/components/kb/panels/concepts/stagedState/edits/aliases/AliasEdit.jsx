import { Box, Typography } from '@mui/material'

import AliasDetail from './AliasDetail'
import AliasReset from './AliasReset'

import { fieldSx } from '@/components/common/format'

const AliasEdit = ({ aliasEdit }) => {
  const [aliasIndex, stagedAction, initialFields, stagedFields] = aliasEdit

  const actionText = `${stagedAction.split(' ').pop()}`
  const aliasName = initialFields?.[0]?.[1] || stagedFields?.[0]?.[1]

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
        <AliasReset aliasIndex={aliasIndex} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={fieldSx}>{actionText}:</Typography>
          <Typography sx={{ ...fieldSx, fontWeight: 'bold', ml: 1 }}>{aliasName}</Typography>
        </Box>
      </Box>
      <AliasDetail initialFields={initialFields} stagedFields={stagedFields} />
    </Box>
  )
}

export default AliasEdit
