import { use, useCallback } from 'react'
import { Box, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { MdOutlinePlaylistAdd } from 'react-icons/md'

import createEditRealizationModal from '@/components/kb/panels/concepts/concept/change/staged/concept/realizations/edit/createEditRealizationModal'
import createEditRealizationOnClose from '@/components/kb/panels/concepts/concept/change/staged/concept/realizations/edit/createEditRealizationOnClose'

import { EMPTY_REALIZATION_ITEM } from '@/components/kb/panels/concepts/concept/change/staged/concept/realizations/edit/realizationItem'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants'

const RealizationAdd = ({ sx }) => {
  const theme = useTheme()

  const { stagedState, initialState, modifyConcept } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  const handleClick = useCallback(() => {
    const realizationIndex = stagedState.realizations.length
    const realizationItem = EMPTY_REALIZATION_ITEM

    const modalData = {
      action: CONCEPT_STATE.REALIZATION.ADD,
      realizationIndex,
      realizationItem,
      modified: false,
    }
    setModalData(modalData)

    const modal = createEditRealizationModal(CONCEPT_STATE.REALIZATION.ADD)
    const onClose = createEditRealizationOnClose({ initialState, modifyConcept })

    setModal(modal, onClose)
  }, [stagedState.realizations.length, initialState, modifyConcept, setModal, setModalData])

  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        backgroundColor: theme.palette.background.paper,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        position: 'static',
        zIndex: 1,
        ...sx,
      }}
    >
      <IconButton
        onClick={handleClick}
        sx={{
          '&:hover': {
            ...theme.kb.icon.hover,
            color: 'add.main',
            transform: 'scale(1.25)',
          },
          backgroundColor: theme.palette.background.paper,
          padding: 0.5,
        }}
      >
        <MdOutlinePlaylistAdd size={24} />
      </IconButton>
    </Box>
  )
}

export default RealizationAdd
