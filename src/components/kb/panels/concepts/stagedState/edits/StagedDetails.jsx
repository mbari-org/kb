import { use, useEffect, useMemo } from 'react'

import { Box } from '@mui/material'

import AliasesDetail from './aliases/AliasesDetail'
import ChildrenDetail from './structure/children/ChildrenDetail'
import FieldDeltaDetail from './field/FieldDeltaDetail'
import FieldValueDetail from './field/FieldValueDetail'
import MediaDetail from './media/MediaDetail'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { hasStateChange, stateUpdates } from '@/contexts/concept/lib/edit/stateUpdates'

const StagedDetails = () => {
  const { stagedState, initialState } = use(ConceptContext)
  const { closeModal } = use(ModalContext)

  const edits = useMemo(
    () =>
      Object.entries(stateUpdates(initialState, stagedState)).sort(([keyA], [keyB]) =>
        keyA.localeCompare(keyB)
      ),
    [initialState, stagedState]
  )

  const editComponent = edit => {
    const [field, { staged }] = edit
    switch (field) {
      case 'aliases':
        return <AliasesDetail key={field} edit={edit} />

      case 'aliasIndex':
      case 'mediaIndex':
        return null

      case 'children':
        return <ChildrenDetail key={field} edit={edit} />

      case 'media':
        return <MediaDetail key={field} edit={edit} />

      case 'nameChange':
        return <FieldValueDetail key={field} field={field} value={staged} />

      default:
        return <FieldDeltaDetail key={field} edit={edit} />
    }
  }

  useEffect(() => {
    if (!hasStateChange(initialState, stagedState)) {
      closeModal(true)
    }
  }, [stagedState, initialState, closeModal])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>{edits.map(editComponent)}</Box>
  )
}

export default StagedDetails
