import { use, useCallback } from 'react'

import { Box, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import createEditAliasModal from '@/components/kb/panels/concepts/detail/aliases/edit/createEditAliasModal'
import createEditAliasOnClose from '@/components/kb/panels/concepts/detail/aliases/edit/createEditAliasOnClose'

import { EMPTY_ALIAS, aliasFields } from '@/components/kb/panels/concepts/detail/aliases/edit/alias'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

const AliasActionButton = ({ Icon, action, aliasIndex, color, sx = {} }) => {
  const theme = useTheme()

  const { initialState, modifyConcept, stagedState } = use(ConceptContext)
  const { setModal, setModalData } = use(ModalContext)

  const handleClick = useCallback(() => {
    const stagedAliasItem = stagedState.aliases[aliasIndex]
    const alias = stagedAliasItem ? aliasFields(stagedAliasItem) : EMPTY_ALIAS

    const actionModalData = {
      action,
      alias,
      aliasIndex,
      modified: false,
    }
    setModalData(actionModalData)

    const modal = createEditAliasModal(action)
    const onClose = createEditAliasOnClose({ initialState, modifyConcept })

    setModal(modal, onClose)
  }, [action, aliasIndex, initialState, modifyConcept, setModal, setModalData, stagedState])

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
        color={color}
        sx={{
          '&:hover': {
            ...theme.kb.icon.hover,
          },
          '& .MuiIconButton-root': {
            backgroundColor: color,
            '&:hover': {
              backgroundColor: `${color} !important`,
            },
            mb: 1,
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

export default AliasActionButton
