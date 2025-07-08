import { use } from 'react'
import { Box, Stack, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import RealizationModifyIcon from '@/components/kb/panels/concepts/concept/change/staged/realizations/RealizationModifyIcon'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import useConceptPending from '@/contexts/panels/concepts/pending/useConceptPending'

import { CONCEPT_STATE } from '@/lib/constants'

import useConceptDetailStyle from '@/components/kb/panels/concepts/concept/change/staged/useConceptDetailStyle'

import { fieldPending } from '@/lib/kb/model/history'

import { fieldBorder } from '@/lib/kb/model/field'

const ConceptRealization = ({ realization }) => {
  const theme = useTheme()

  const { concept, editing } = use(ConceptContext)

  const conceptPending = useConceptPending(concept.name)

  const realizationPending = fieldPending(conceptPending, 'LinkRealization')

  const detailStyle = useConceptDetailStyle('realizations')
  const infoStyle = {
    ...detailStyle,
    disabled: true,
    variant: 'standard',
  }

  const border = fieldBorder({
    itemPending: realizationPending,
    noActionBorderColor: 'none',
    stagedItem: realization,
    theme,
    width: '2px',
  })

  if (!realization) {
    return null
  }

  const showEdit =
    editing && !realization.historyId && realization.action !== CONCEPT_STATE.REALIZATION.DELETE
  const showDelete =
    editing && !realization.historyId && realization.action !== CONCEPT_STATE.REALIZATION.ADD

  const realizationIcon = action => {
    return <RealizationModifyIcon action={action} realizationIndex={realization.index} size={20} />
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
