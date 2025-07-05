import { use, useCallback } from 'react'
import { Box, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { MdOutlinePlaylistAdd } from 'react-icons/md'

import createEditAliasModal from '@/components/kb/panels/concepts/concept/change/staged/concept/aliases/edit/createEditAliasModal'
import createEditAliasOnClose from '@/components/kb/panels/concepts/concept/change/staged/concept/aliases/edit/createEditAliasOnClose'
import ConceptAlias from '@/components/kb/panels/concepts/concept/detail/aliases/ConceptAlias'
import ConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertiesSection'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { EMPTY_ALIAS } from '@/lib/kb/model/alias'
import { CONCEPT_STATE } from '@/lib/constants'

const ConceptAliases = () => {
  const theme = useTheme()
  const { editing, stagedState, initialState, modifyConcept } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  const aliases = stagedState?.aliases || []

  const renderAliasItem = (alias, index) => ({
    key: alias.name || alias.index || index,
    content: `${alias.name || ''} | ${alias.author || ''} | ${alias.nameType || ''}`,
  })

  const renderAliasComponent = (alias, _index) => <ConceptAlias alias={alias} />

  const AddIcon = () => (
    <Box
      sx={{
        alignItems: 'flex-start',
        backgroundColor: theme.palette.background.paper,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 1,
      }}
    >
      <IconButton
        onClick={handleAddClick}
        sx={{
          '&:hover': {
            ...theme.kb.icon.hover,
            color: 'add.main',
          },
          backgroundColor: theme.palette.background.paper,
          padding: 0.5,
        }}
      >
        <MdOutlinePlaylistAdd size={24} />
      </IconButton>
    </Box>
  )

  const handleAddClick = useCallback(() => {
    const aliasIndex = aliases.length
    const alias = EMPTY_ALIAS

    const actionModalData = {
      action: CONCEPT_STATE.ALIAS.ADD,
      alias,
      aliasIndex,
      modified: { author: false, name: false, nameType: false },
    }
    setModalData(actionModalData)

    const modal = createEditAliasModal(CONCEPT_STATE.ALIAS.ADD)
    const onClose = createEditAliasOnClose({ initialState, modifyConcept })

    setModal(modal, onClose)
  }, [aliases.length, initialState, modifyConcept, setModal, setModalData])

  return (
    <ConceptPropertiesSection
      items={aliases}
      disablePagination={true}
      onInspect={editing ? handleAddClick : undefined}
      onInspectTooltip={editing ? 'Add new alias for this concept' : undefined}
      renderItem={renderAliasItem}
      renderComponent={renderAliasComponent}
      title='Alternate Names'
      IconComponent={editing ? AddIcon : undefined}
    />
  )
}

export default ConceptAliases
