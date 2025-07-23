import { use, useEffect, useMemo } from 'react'

import { Box } from '@mui/material'

import StagedAliases from '@/components/kb/panels/concepts/concept/change/staged/aliases/StagedAliases'
import StagedAuthor from '@/components/kb/panels/concepts/concept/change/staged/author/StagedAuthor'
import StagedRank from '@/components/kb/panels/concepts/concept/change/staged/rank/StagedRank'
import StagedRealizations from '@/components/kb/panels/concepts/concept/change/staged/realizations/StagedRealizations'

import ChildrenDetail from '@/components/kb/panels/concepts/concept/change/staged/structure/children/ChildrenDetail'
import ConceptRankDetail from '@/components/kb/panels/concepts/concept/change/staged/rank/ConceptRankDetail'
import FieldDeltaDetail from '@/components/kb/panels/concepts/concept/change/staged/field/FieldDeltaDetail'
import FieldValueDetail from '@/components/kb/panels/concepts/concept/change/staged/field/FieldValueDetail'
import MediaDetail from '@/components/kb/panels/concepts/concept/change/staged/media/MediaDetail'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { hasStateChange, stateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'

import { CONCEPT_FIELD, CONCEPT_STATE } from '@/lib/constants'

const { GROUP } = CONCEPT_STATE

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
        return <StagedAuthor key={field} stagedEdit={stagedEdit} />

      case CONCEPT_FIELD.RANK:
        return <StagedRank key={field} stagedEdit={stagedEdit} />

      case CONCEPT_FIELD.REALIZATIONS:
        return <StagedRealizations key={field} stagedEdit={stagedEdit} />

      case 'children':
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
