import { use } from 'react'
import { Box, Typography } from '@mui/material'

import RealizationEdit from './RealizationEdit'
import RealizationsReset from './reset/RealizationsReset'

import { fieldSx } from '@/components/common/format'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { resettingRealization } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { realizationEdits } from '@/lib/kb/state/realizations'
import { RESETTING } from '@/lib/constants'

const RealizationsDetail = ({ edit }) => {
  const { confirmReset } = use(ConceptContext)

  const realizationsSx =
    resettingRealization(confirmReset) === RESETTING.EXTENT.OTHER
      ? { ...fieldSx, color: 'text.disabled' }
      : fieldSx

  const [_, realizations] = edit
  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <RealizationsReset />
        <Typography sx={realizationsSx}>Realizations</Typography>
      </Box>
      <Box sx={{ ml: 3 }}>
        {realizationEdits(realizations).map(realizationEdit => {
          const { action, index } = realizationEdit
          return (
            <RealizationEdit
              key={`${action}-${index}`}
              disabled={resettingRealization(confirmReset, index) === RESETTING.EXTENT.OTHER}
              initial={realizations.initial?.[index]}
              realizationEdit={realizationEdit}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default RealizationsDetail
