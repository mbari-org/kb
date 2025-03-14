import { Box, Typography } from '@mui/material'

import AliasEdit from './AliasEdit'
import AliasesReset from './AliasesReset'

import { fieldSx } from '@/components/common/format'
import { aliasEdits } from '@/lib/kb/concept/aliases'

const AliasesDetail = ({ edit }) => {
  const [_, { initial, staged }] = edit
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
        {aliasEdits(initial, staged).map(aliasEdit => {
          const index = aliasEdit.index
          const aliasName = initial?.[index]?.name || staged?.[index]?.name
          return (
            <AliasEdit
              key={`${aliasEdit[1]}-${index}`}
              aliasEdit={aliasEdit}
              aliasName={aliasName}
              initial={initial[index]}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default AliasesDetail
