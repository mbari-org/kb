import { Box, Typography } from '@mui/material'

import AliasEdit from './AliasEdit'
import AliasesReset from './AliasesReset'

import { fieldSx } from '@/components/common/format'
import { aliasEdits } from '@/lib/kb/concept/aliases'

const AliasesDetail = ({ edit }) => {
  const [_, { initial, editing }] = edit

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
        {aliasEdits(initial, editing).map(aliasEdit => {
          if (aliasEdit === null) {
            return null
          }
          const [_aliasIndex, editingAction, _initialFields, _editingFields] = aliasEdit
          return <AliasEdit key={editingAction} aliasEdit={aliasEdit} />
        })}
      </Box>
    </Box>
  )
}

export default AliasesDetail
