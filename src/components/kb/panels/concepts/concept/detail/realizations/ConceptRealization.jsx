import { use } from 'react'
import { Box, Link, Stack, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import RealizationActionIcon from '@/components/kb/panels/concepts/concept/change/staged/realizations/RealizationActionIcon'
import createConceptRealizationModal from '@/components/kb/panels/concepts/concept/detail/realizations/createConceptRealizationModal'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

import useConceptDetailStyle from '@/components/kb/panels/concepts/concept/change/staged/useConceptDetailStyle'

import { stagedBorder } from '@/lib/concept/state/staged'

const ConceptRealization = ({ realization }) => {
  const theme = useTheme()

  const { isEditing } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  const detailStyle = useConceptDetailStyle(CONCEPT.FIELD.REALIZATIONS)

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
    isEditing && !realization.historyId && realization.action !== CONCEPT_STATE.REALIZATION.DELETE
  const showDelete =
    isEditing && !realization.historyId && realization.action !== CONCEPT_STATE.REALIZATION.ADD

  const realizationIcon = action => {
    return <RealizationActionIcon action={action} realizationIndex={realization.index} size={20} />
  }

  const handleViewRealization = () => {
    const modal = createConceptRealizationModal(realization)
    setModalData({ realization })
    setModal(modal)
  }

  const linkNameLabel = realization.linkName?.trim() || 'View Realization'

  return (
    <Stack alignItems='center' direction='row' spacing={1} width='100%' sx={{ border, ml: -1 }}>
      <Stack direction='column' spacing={-0.5}>
        {showEdit && realizationIcon(CONCEPT_STATE.REALIZATION.EDIT)}
        {showDelete && realizationIcon(CONCEPT_STATE.REALIZATION.DELETE)}
      </Stack>
      <Stack direction='row' spacing={1} width='100%'>
        <Box sx={{ pl: 0, width: 200, flexShrink: 0 }}>
          <Stack spacing={0.25}>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', lineHeight: 1.66, pl: 1.75 }}>
              Link Name
            </Typography>
            <Link
              component='button'
              onClick={handleViewRealization}
              sx={{
                alignSelf: 'flex-start',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                overflowWrap: 'anywhere',
                pl: 1.75,
                textAlign: 'left',
                textTransform: 'none',
              }}
              underline='hover'
            >
              {linkNameLabel}
            </Link>
          </Stack>
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
