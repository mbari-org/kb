import { use, useEffect, useMemo } from 'react'

import { Box } from '@mui/material'

import AliasesDetail from '@/components/kb/panels/concepts/concept/change/staged/concept/aliases/AliasesDetail'
import ChildrenDetail from '@/components/kb/panels/concepts/concept/change/staged/concept/structure/children/ChildrenDetail'
import FieldDeltaDetail from '@/components/kb/panels/concepts/concept/change/staged/concept/field/FieldDeltaDetail'
import FieldValueDetail from '@/components/kb/panels/concepts/concept/change/staged/concept/field/FieldValueDetail'
import MediaDetail from '@/components/kb/panels/concepts/concept/change/staged/concept/media/MediaDetail'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

import { hasStateChange, stateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'

const StagedContent = () => {
  const { stagedState, initialState } = use(ConceptContext)
  const { closeModal } = use(PanelModalContext)

  const edits = useMemo(
    () =>
      Object.entries(stateUpdates(initialState, stagedState)).sort(([keyA], [keyB]) =>
        keyA.localeCompare(keyB)
      ),
    [initialState, stagedState]
  )

  const detailComponent = edit => {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {edits.map(detailComponent)}
    </Box>
  )
}

export default StagedContent
