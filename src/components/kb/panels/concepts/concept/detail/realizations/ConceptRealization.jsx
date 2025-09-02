import { use } from 'react'
import { Box, Stack, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import RealizationActionIcon from '@/components/kb/panels/concepts/concept/change/staged/realizations/RealizationActionIcon'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants'

import useConceptDetailStyle from '@/components/kb/panels/concepts/concept/change/staged/useConceptDetailStyle'

import { stagedBorder } from '@/lib/kb/state/staged'

const ConceptRealization = ({ realization }) => {
  const theme = useTheme()

  const { editing } = use(ConceptContext)

  const detailStyle = useConceptDetailStyle('realizations')

  if (!realization) {
    return null
  }

  const infoStyle = {
    ...detailStyle,
    disabled: true,
    variant: 'standard',
  }

  const border = stagedBorder({
    noActionBorderColor: 'none',
    stagedItem: realization,
    theme,
    width: '2px',
  })

  const showEdit =
    editing && !realization.historyId && realization.action !== CONCEPT_STATE.REALIZATION.DELETE
  const showDelete =
    editing && !realization.historyId && realization.action !== CONCEPT_STATE.REALIZATION.ADD

  const realizationIcon = action => {
    return <RealizationActionIcon action={action} realizationIndex={realization.index} size={20} />
  }

  return (
    <Stack alignItems='center' direction='row' spacing={1} width='100%' sx={{ border, ml: -1 }}>
      <Stack direction='column' spacing={-0.5}>
        {showEdit && realizationIcon(CONCEPT_STATE.REALIZATION.EDIT)}
        {showDelete && realizationIcon(CONCEPT_STATE.REALIZATION.DELETE)}
      </Stack>
      <Stack direction='row' spacing={1} width='100%'>
        <Box sx={{ pl: 0, width: 200, flexShrink: 0 }}>
          <TextField {...infoStyle} label='Link Name' value={realization.linkName || ''} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField {...infoStyle} label='To Concept' value={realization.toConcept || ''} />
        </Box>
        <Box sx={{ flex: 1.5 }}>
          <TextField {...infoStyle} label='Link Value' value={realization.linkValue || ''} />
        </Box>
      </Stack>
    </Stack>
  )
}

export default ConceptRealization
