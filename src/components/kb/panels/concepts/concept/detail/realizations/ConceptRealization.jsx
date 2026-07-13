import { use } from 'react'
import { Box, Stack, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import RealizationActionIcon from '@/components/kb/panels/concepts/concept/change/staged/realizations/RealizationActionIcon'
import createConceptRealizationModal from '@/components/kb/panels/concepts/concept/detail/realizations/createConceptRealizationModal'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

import useConceptDetailStyle from '@/components/kb/panels/concepts/concept/change/staged/useConceptDetailStyle'

import { stagedBorder } from '@/lib/concept/state/staged'

const ConceptRealization = ({ realization, widths = [20, 30, 50], rowSx = {} }) => {
  const theme = useTheme()

  const { isEditing } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  const detailStyle = useConceptDetailStyle(CONCEPT.FIELD.REALIZATIONS)

  if (!realization) {
    return null
  }

  const infoStyle = {
    ...detailStyle,
    InputProps: { readOnly: true },
    variant: 'standard',
  }

  const border = stagedBorder({
    noActionBorderColor: 'none',
    stagedItem: realization,
    theme,
    width: '2px',
  })

  const showEdit = isEditing && !realization.historyId && realization.action !== CONCEPT_STATE.REALIZATION.DELETE
  const showDelete = isEditing && !realization.historyId && realization.action !== CONCEPT_STATE.REALIZATION.ADD

  const realizationIcon = action => {
    return <RealizationActionIcon action={action} realizationIndex={realization.index} size={20} />
  }

  const handleViewRealization = () => {
    const modal = createConceptRealizationModal(realization)
    setModalData({ realization })
    setModal(modal)
  }

  const linkNameLabel = realization.linkName?.trim() || 'View Realization'
  const toConceptLabel = realization.toConcept || ''
  const linkValueLabel = realization.linkValue || ''
  const [linkNameWidth = 20, toConceptWidth = 30, linkValueWidth = 50] = widths

  return (
    <Stack direction='row' spacing={1} width='100%' sx={{ alignItems: 'center', border, ...rowSx }}>
      <Stack direction='column' spacing={-0.5}>
        {showEdit && realizationIcon(CONCEPT_STATE.REALIZATION.EDIT)}
        {showDelete && realizationIcon(CONCEPT_STATE.REALIZATION.DELETE)}
      </Stack>
      <Stack direction='row' spacing={1} width='100%' sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            flex: `0 0 ${linkNameWidth}%`,
            maxWidth: `${linkNameWidth}%`,
            minWidth: 0,
            pl: 0,
            position: 'relative',
          }}
        >
          <Box
            aria-label='View realization'
            component='button'
            onClick={handleViewRealization}
            sx={{
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              inset: 0,
              p: 0,
              position: 'absolute',
              zIndex: 1,
            }}
            type='button'
          />
          <TextField
            {...infoStyle}
            label='Link Name'
            sx={{
              ...infoStyle.sx,
              '& .MuiInputBase-input': {
                ...(infoStyle.sx?.['& .MuiInputBase-input'] || {}),
                WebkitTextFillColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
              '& .MuiInputBase-input.Mui-disabled': {
                ...(infoStyle.sx?.['& .MuiInputBase-input.Mui-disabled'] || {}),
                WebkitTextFillColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
              },
            }}
            title={linkNameLabel}
            value={linkNameLabel}
          />
        </Box>
        <Box sx={{ flex: `0 0 ${toConceptWidth}%`, maxWidth: `${toConceptWidth}%`, minWidth: 0 }}>
          <TextField
            {...infoStyle}
            label='To Concept'
            sx={{
              ...infoStyle.sx,
              '& .MuiInputBase-input': {
                ...(infoStyle.sx?.['& .MuiInputBase-input'] || {}),
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
            }}
            title={toConceptLabel}
            value={toConceptLabel}
          />
        </Box>
        <Box sx={{ flex: `0 0 ${linkValueWidth}%`, maxWidth: `${linkValueWidth}%`, minWidth: 0 }}>
          <TextField
            {...infoStyle}
            label='Link Value'
            sx={{
              ...infoStyle.sx,
              '& .MuiInputBase-input': {
                ...(infoStyle.sx?.['& .MuiInputBase-input'] || {}),
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
            }}
            title={linkValueLabel}
            value={linkValueLabel}
          />
        </Box>
      </Stack>
    </Stack>
  )
}

export default ConceptRealization
