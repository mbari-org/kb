import { use, useCallback, useEffect, useMemo, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import useDisplayPending from '@/components/kb/panels/concepts/concept/change/pending/modal/useDisplayPending'
import useDisplayStaged from '@/components/kb/panels/concepts/concept/change/staged/modal/useDisplayStaged'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { isStateModified } from '@/lib/kb/state'
import { pendingChild } from '@/lib/kb/model/history'
import useConceptPending from '@/contexts/panels/concepts/pending/useConceptPending'

import { CONCEPT_STATE, LABELS, RESETTING } from '@/lib/constants'

const { DISCARD, DISCARD_ALL } = LABELS.BUTTON
const { CANCEL, EDIT, PENDING, SAVE, STAGED } = LABELS.CONCEPT.ACTION
const { TO_INITIAL } = CONCEPT_STATE.RESET
const { CONFIRMED } = RESETTING

const ConceptEditingActions = () => {
  const [isModified, setIsModified] = useState(false)

  const { concept, editing, initialState, modifyConcept, setEditing, stagedState } =
    use(ConceptContext)

  const conceptPending = useConceptPending(concept.name)
  const parentPending = useConceptPending(concept.parent)

  const displayPending = useDisplayPending()
  const displayStaged = useDisplayStaged()

  useEffect(() => {
    setIsModified(isStateModified({ initialState, stagedState }))
  }, [initialState, stagedState])

  const editCancelDiscardButtonText = useMemo(() => {
    if (!editing) return EDIT
    if (isModified) return DISCARD_ALL
    return CANCEL
  }, [editing, isModified])

  const handleCancelDiscard = useCallback(() => {
    if (!editing) {
      setEditing(true)
    } else if (!isModified) {
      setEditing(false)
    } else {
      modifyConcept({ type: TO_INITIAL })
      displayStaged(DISCARD)
    }
  }, [editing, isModified, modifyConcept, setEditing, displayStaged])

  const handlePending = useCallback(() => {
    displayPending(PENDING)
  }, [displayPending])

  const handleSave = useCallback(() => {
    modifyConcept({ type: CONFIRMED.NO })
    displayStaged(SAVE)
  }, [modifyConcept, displayStaged])

  const handleStaged = useCallback(() => {
    modifyConcept({ type: CONFIRMED.NO })
    displayStaged(STAGED)
  }, [modifyConcept, displayStaged])

  const showPendingButton = useMemo(() => {
    const hasPending = conceptPending.length > 0 || pendingChild(parentPending, concept.name)
    return !editing && hasPending
  }, [conceptPending.length, parentPending, concept.name, editing])

  return (
    <Box
      sx={{
        alignItems: 'center',
        bottom: 70,
        display: 'flex',
        justifyContent: 'space-between',
        left: 10,
        position: 'absolute',
        right: 15,
      }}
    >
      <Button color={editing ? 'cancel' : 'main'} onClick={handleCancelDiscard} variant='contained'>
        {editCancelDiscardButtonText}
      </Button>
      {editing && isModified && (
        <Button onClick={handleStaged} sx={{ margin: '0 10px' }} variant='contained'>
          {STAGED}
        </Button>
      )}
      {showPendingButton && (
        <Button color='main' onClick={handlePending} variant='contained'>
          {PENDING}
        </Button>
      )}
      <Button disabled={!editing || !isModified} onClick={handleSave} variant='contained'>
        {SAVE}
      </Button>
    </Box>
  )
}

export default ConceptEditingActions
