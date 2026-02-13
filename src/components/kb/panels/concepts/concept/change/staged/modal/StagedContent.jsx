import { use, useEffect, useMemo } from 'react'

import { Box, Stack } from '@mui/material'

import ModalActionText from '@/components/common/ModalActionText'

import StagedAliases from '@/components/kb/panels/concepts/concept/change/staged/aliases/StagedAliases'
import StagedChildren from '@/components/kb/panels/concepts/concept/change/staged/children/StagedChildren'
import StagedMedia from '@/components/kb/panels/concepts/concept/change/staged/media/StagedMedia'
import StagedRealizations from '@/components/kb/panels/concepts/concept/change/staged/realizations/StagedRealizations'

import StagedObject from '@/components/kb/panels/concepts/concept/change/staged/StagedObject'
import StagedValue from '@/components/kb/panels/concepts/concept/change/staged/StagedValue'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { stateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import { isStateModified } from '@/lib/concept/state/state'

import CONFIG from '@/text'
import { CONCEPT } from '@/lib/constants'

const { STAGED, CONCEPT: CONCEPT_MODALS } = CONFIG.PANELS.CONCEPTS.MODALS

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
    const [field, _] = stagedEdit
    switch (field) {
      case CONCEPT.FIELD.ALIASES:
        return <StagedAliases key={field} stagedEdit={stagedEdit} />

      case CONCEPT.FIELD.AUTHOR:
        return <StagedValue key={field} group={CONCEPT_MODALS.AUTHOR} stagedEdit={stagedEdit} />

      case CONCEPT.FIELD.CHILDREN:
        return <StagedChildren key={field} stagedEdit={stagedEdit} />

      case CONCEPT.FIELD.MEDIA:
        return <StagedMedia key={field} stagedEdit={stagedEdit} />

      case CONCEPT.FIELD.NAME:
        return <StagedObject key={field} group={CONCEPT_MODALS.NAME} stagedEdit={stagedEdit} />

      case CONCEPT.FIELD.PARENT:
        return <StagedValue key={field} group={CONCEPT_MODALS.PARENT} stagedEdit={stagedEdit} />

      case CONCEPT.FIELD.RANK:
        return <StagedObject key={field} group={CONCEPT_MODALS.RANK} stagedEdit={stagedEdit} />

      case CONCEPT.FIELD.REALIZATIONS:
        return <StagedRealizations key={field} stagedEdit={stagedEdit} />

      default:
        return null
    }
  }

  useEffect(() => {
    if (!isStateModified({ initialState, stagedState })) {
      closeModal(true)
    }
  }, [closeModal, initialState, stagedState])

  return (
    <Stack direction='column' spacing={1}>
      <ModalActionText text={STAGED.DESCRIPTION} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {stagedEdits.map(stagedComponent)}
      </Box>
    </Stack>
  )
}

export default StagedContent
