import { use } from 'react'
import { Box, Typography } from '@mui/material'

import AliasEdit from './AliasEdit'
import AliasesReset from './reset/AliasesReset'

import { fieldSx } from '@/components/common/format'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { aliasResetting } from '@/components/kb/panels/concept/change/staged/concept/staged'

import { aliasEdits } from '@/lib/kb/model/alias'
import { RESETTING } from '@/lib/constants'

const AliasesDetail = ({ edit }) => {
  const { confirmReset } = use(ConceptContext)

  const aliasesSx =
    aliasResetting(confirmReset) === RESETTING.OTHER
      ? { ...fieldSx, color: 'text.disabled' }
      : fieldSx

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
        <Typography sx={aliasesSx}>Aliases</Typography>
      </Box>
      <Box sx={{ ml: 3 }}>
        {aliasEdits(aliases).map(aliasEdit => {
          const { action, index } = aliasEdit
          return (
            <AliasEdit
              key={`${action}-${index}`}
              aliasEdit={aliasEdit}
              initial={aliases.initial?.[index]}
              disabled={aliasResetting(confirmReset, index) === RESETTING.OTHER}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default AliasesDetail
