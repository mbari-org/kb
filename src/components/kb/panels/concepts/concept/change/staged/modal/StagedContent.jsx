import { use, useEffect, useMemo } from 'react'

import { Box } from '@mui/material'

import StagedAliases from '@/components/kb/panels/concepts/concept/change/staged/aliases/StagedAliases'
import StagedRealizations from '@/components/kb/panels/concepts/concept/change/staged/realizations/StagedRealizations'

import StagedObject from '@/components/kb/panels/concepts/concept/change/staged/StagedObject'
import StagedValue from '@/components/kb/panels/concepts/concept/change/staged/StagedValue'

import ChildrenDetail from '@/components/kb/panels/concepts/concept/change/staged/children/ChildrenDetail'
import FieldValueDetail from '@/components/kb/panels/concepts/concept/change/staged/field/FieldValueDetail'
import MediaDetail from '@/components/kb/panels/concepts/concept/change/staged/media/MediaDetail'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { hasStateChange, stateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'

import { CONCEPT_FIELD, RESETTING } from '@/lib/constants'

const StagedContent = () => {
  const { initialState, stagedState } = use(ConceptContext)
  const { closeModal } = use(ConceptModalContext)

  const stagedEdits = useMemo(
    () =>
      Object.entries(stateUpdates(initialState, stagedState)).sort(([keyA], [keyB]) =>
        keyA.localeCompare(keyB)
      ),
    [initialState, stagedState]
  )

  const stagedComponent = stagedEdit => {
    const [field, { staged }] = stagedEdit
    switch (field) {
      case CONCEPT_FIELD.ALIASES:
        return <StagedAliases key={field} stagedEdit={stagedEdit} />

      case CONCEPT_FIELD.AUTHOR:
        return <StagedValue key={field} group={RESETTING.AUTHOR} stagedEdit={stagedEdit} />

      case CONCEPT_FIELD.NAME:
        return <StagedObject key={field} group={RESETTING.NAME} stagedEdit={stagedEdit} />

      case CONCEPT_FIELD.PARENT:
        return <StagedValue key={field} group={RESETTING.PARENT} stagedEdit={stagedEdit} />

      case CONCEPT_FIELD.RANK:
        return <StagedObject key={field} group={RESETTING.RANK} stagedEdit={stagedEdit} />

      case CONCEPT_FIELD.REALIZATIONS:
        return <StagedRealizations key={field} stagedEdit={stagedEdit} />

      case CONCEPT_FIELD.CHILDREN:
        return <ChildrenDetail key={field} edit={stagedEdit} />

      case CONCEPT_FIELD.MEDIA:
        return <MediaDetail key={field} edit={stagedEdit} />

      case 'nameChange':
        return <FieldValueDetail key={field} field={field} value={staged} />

      default:
        return null
    }
  }

  useEffect(() => {
    if (!hasStateChange(initialState, stagedState)) {
      closeModal(true)
    }
  }, [closeModal, initialState, stagedState])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {stagedEdits.map(stagedComponent)}
    </Box>
  )
}

export default StagedContent
