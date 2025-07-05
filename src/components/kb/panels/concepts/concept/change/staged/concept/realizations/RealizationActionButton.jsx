import { use, useCallback } from 'react'

import { Box, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import createEditRealizationModal from '@/components/kb/panels/concepts/concept/change/staged/concept/realizations/edit/createEditRealizationModal'
import createEditRealizationOnClose from '@/components/kb/panels/concepts/concept/change/staged/concept/realizations/edit/createEditRealizationOnClose'

import {
  EMPTY_REALIZATION_ITEM,
  realizationItemFields,
} from '@/components/kb/panels/concepts/concept/change/staged/concept/realizations/edit/realizationItem'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

const RealizationActionButton = ({ Icon, action, realizationIndex, color, sx = {} }) => {
  const theme = useTheme()

  const { stagedState, initialState, modifyConcept } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  const handleClick = useCallback(() => {
    const stagedRealizationItem = stagedState.realizations[realizationIndex]
    const realizationItem = stagedRealizationItem
      ? realizationItemFields(stagedRealizationItem)
      : EMPTY_REALIZATION_ITEM

    const modalData = {
      action,
      realizationIndex,
      realizationItem,
      modified: false,
    }
    setModalData(modalData)

    const modal = createEditRealizationModal(action)
    const onClose = createEditRealizationOnClose({ initialState, modifyConcept })

    setModal(modal, onClose)
  }, [action, realizationIndex, initialState, modifyConcept, setModal, setModalData, stagedState])

  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        backgroundColor: theme.palette.background.paper,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 1,
        ...sx,
      }}
    >
      <IconButton
        onClick={handleClick}
        sx={{
          '&:hover': {
            ...theme.kb.icon.hover,
            color: `${color}.main`,
            transform: 'scale(1.25)',
          },
          backgroundColor: theme.palette.background.paper,
          padding: 0.5,
        }}
      >
        <Icon />
      </IconButton>
    </Box>
  )
}

export default RealizationActionButton
