import { Box, Typography } from '@mui/material'

import AliasEdit from './AliasEdit'
import AliasesReset from './AliasesReset'

import { fieldSx } from '@/components/common/format'
import { aliasEdits } from '@/lib/kb/concept/aliases'

const AliasesDetail = ({ edit }) => {
  const [_, aliases] = edit
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <AliasesReset />
        <Typography sx={fieldSx}>Aliases</Typography>
      </Box>
      <Box sx={{ ml: 3 }}>
        {aliasEdits(aliases).map(aliasEdit => {
          const { action, index } = aliasEdit
          return (
            <AliasEdit
              key={`${action}-${index}`}
              aliasEdit={aliasEdit}
              initial={aliases.initial?.[index]}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default AliasesDetail
