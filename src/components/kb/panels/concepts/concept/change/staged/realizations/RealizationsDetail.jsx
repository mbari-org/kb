import { use } from 'react'
import { Box, Typography } from '@mui/material'

import RealizationEdit from './RealizationEdit'
import RealizationsReset from './reset/RealizationsReset'

import { fieldSx } from '@/components/common/format'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { realizationResetting } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { realizationEdits } from '@/lib/kb/model/realization'
import { RESETTING } from '@/lib/constants'

const RealizationsDetail = ({ edit }) => {
  const { confirmReset } = use(ConceptContext)

  const realizationsSx =
    realizationResetting(confirmReset) === RESETTING.OTHER
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
              realizationEdit={realizationEdit}
              disabled={realizationResetting(confirmReset, index) === RESETTING.OTHER}
              initial={realizations.initial?.[index]}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default RealizationsDetail

