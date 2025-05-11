import { use } from 'react'
import { Box, Typography } from '@mui/material'

import AliasEdit from './AliasEdit'
import AliasesReset from './AliasesReset'

import { fieldSx } from '@/components/common/format'
import { aliasEdits } from '@/lib/kb/model/alias'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'

import { RESETTING } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const AliasesDetail = ({ edit }) => {
  const { confirmDiscard } = use(ConceptContext)

  const resettingAlias = index => {
    if (!confirmDiscard) return RESETTING.NONE
    if (confirmDiscard.type === RESET.ALIASES) return RESETTING.ME
    if (confirmDiscard.type === RESET.ALIAS && confirmDiscard.update?.index === index)
      return RESETTING.ME
    if (confirmDiscard.type === RESET.TO_INITIAL) return RESETTING.ME
    return RESETTING.OTHER
  }

  const aliasesSx =
    resettingAlias() === RESETTING.OTHER ? { ...fieldSx, color: 'text.disabled' } : fieldSx

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
              changing={resettingAlias(index)}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default AliasesDetail
