import { use, useCallback, useMemo } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import useDisplayPending from '@/components/kb/panels/concepts/concept/change/pending/modal/useDisplayPending'
import useDisplayStaged from '@/components/kb/panels/concepts/concept/change/staged/modal/useDisplayStaged'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { isStateModified } from '@/lib/kb/state'
import { pendingChild } from '@/lib/kb/model/history'

import { CONCEPT_STATE, LABELS, PENDING, RESETTING } from '@/lib/constants'

const { DISCARD, DISCARD_ALL } = LABELS.BUTTON
const { CANCEL, EDIT, PENDING: PENDING_ACTION, SAVE, STAGED } = LABELS.CONCEPT.ACTION
const { TO_INITIAL } = CONCEPT_STATE.RESET
const { CONFIRMED } = RESETTING

const ConceptEditingActions = () => {
  const { concept, isEditing, initialState, modifyConcept, pending, setEditing, stagedState } =
    use(ConceptContext)

  const pendingConcept = pending(PENDING.DATA.CONCEPT)
  const pendingParent = pending(PENDING.DATA.PARENT)

  const displayPending = useDisplayPending()
  const displayStaged = useDisplayStaged()

  const isModified = useMemo(
    () => isStateModified({ initialState, stagedState }),
    [initialState, stagedState]
  )

  const editCancelDiscardButtonText = useMemo(() => {
    if (!isEditing) return EDIT
    if (isModified) return DISCARD_ALL
    return CANCEL
  }, [isEditing, isModified])

  const handleCancelDiscard = useCallback(() => {
    if (!isEditing) {
      setEditing(true)
    } else if (!isModified) {
      setEditing(false)
    } else {
      modifyConcept({ type: TO_INITIAL })
      displayStaged(DISCARD)
    }
  }, [isEditing, isModified, modifyConcept, setEditing, displayStaged])

  const handlePending = useCallback(() => {
    displayPending(PENDING_ACTION)
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
    const hasPending = pendingConcept?.length > 0 || pendingChild(pendingParent, concept.name)
    return !isEditing && hasPending
  }, [pendingConcept, pendingParent, concept.name, isEditing])

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
      <Button color={isEditing ? 'cancel' : 'main'} onClick={handleCancelDiscard} variant='contained'>
        {editCancelDiscardButtonText}
      </Button>
      {isEditing && isModified && (
        <Button onClick={handleStaged} sx={{ margin: '0 10px' }} variant='contained'>
          {STAGED}
        </Button>
      )}
      {showPendingButton && (
        <Button color='main' onClick={handlePending} variant='contained'>
          {PENDING_ACTION}
        </Button>
      )}
      <Button disabled={!isEditing || !isModified} onClick={handleSave} variant='contained'>
        {SAVE}
      </Button>
    </Box>
  )
}

export default ConceptEditingActions
