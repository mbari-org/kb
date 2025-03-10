import { use } from 'react'

import { IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { MdOutlinePlaylistAdd } from 'react-icons/md'

import { EMPTY_ALIAS } from '@/components/kb/panels/concepts/detail/aliases/add/alias'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import createAddAliasModal from './createAddAliasModal'
import createAddAliasOnClose from './createAddAliasOnClose'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const AliasAdd = () => {
  const theme = useTheme()

  const { stagedState, initialState, modifyConcept } = use(ConceptContext)
  const { setModal, setModalData } = use(ModalContext)

  const handleClick = () => {
    const aliasIndex = stagedState.aliases.length

    const modalData = {
      action: CONCEPT_STATE.ALIAS.ADD,
      alias: EMPTY_ALIAS,
      aliasIndex,
      modified: false,
    }
    setModalData(modalData)

    const setAliasData = update => setModalData(prev => ({ ...prev, ...update }))

    const modal = createAddAliasModal(setAliasData)
    const onClose = createAddAliasOnClose({ initialState, modifyConcept })

    setModal(modal, onClose)
  }

  return (
    <IconButton
      color='main'
      onClick={handleClick}
      sx={{
        '&:hover': {
          ...theme.kb.icon.hover,
        },
        backgroundColor: theme.palette.background.paper,
        mb: 1,
      }}
    >
      <MdOutlinePlaylistAdd />
    </IconButton>
  )
}

export default AliasAdd
