import { use, useCallback, useMemo } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import useDisplayPending from '@/components/kb/panels/concepts/concept/change/pending/modal/useDisplayPending'
import useStagedModal from '@/components/kb/panels/concepts/concept/change/staged/modal/useStagedModal'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { hasModifiedState } from '@/lib/kb/state/concept'
import { pendingChild } from '@/lib/kb/model/history'
import useConceptPending from '@/contexts/panels/concepts/pending/useConceptPending'

import { CONCEPT_STATE, LABELS } from '@/lib/constants'

const { DISCARD, DISCARD_ALL } = LABELS.BUTTON
const { CANCEL, EDIT, PENDING, SAVE, SHOW } = LABELS.CONCEPT.ACTION
const { CONFIRMED, TO_INITIAL } = CONCEPT_STATE.RESET

const ConceptEditingActions = () => {
  const { concept, editing, initialState, modifyConcept, setEditing, stagedState } =
    use(ConceptContext)

  const conceptPending = useConceptPending(concept.name)
  const parentPending = useConceptPending(concept.parent)

  const displayPending = useDisplayPending()
  const displayStaged = useStagedModal()

  const editCancelDiscardButtonText = useMemo(() => {
    if (!editing) return EDIT
    if (hasModifiedState({ initialState, stagedState })) return DISCARD_ALL
    return CANCEL
  }, [editing, initialState, stagedState])

  const handleCancelDiscard = useCallback(() => {
    if (!editing) {
      setEditing(true)
    } else if (!hasModifiedState({ initialState, stagedState })) {
      setEditing(false)
    } else {
      modifyConcept({ type: TO_INITIAL })
      displayStaged(DISCARD)
    }
  }, [editing, initialState, modifyConcept, setEditing, stagedState, displayStaged])

  const handlePending = useCallback(() => {
    displayPending(PENDING)
  }, [displayPending])

  const handleSave = useCallback(() => {
    modifyConcept({ type: CONFIRMED.NO })
    displayStaged(SAVE)
  }, [modifyConcept, displayStaged])

  const handleShow = useCallback(() => {
    modifyConcept({ type: CONFIRMED.NO })
    displayStaged(SHOW)
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
      {editing && hasModifiedState({ initialState, stagedState }) && (
        <Button onClick={handleShow} sx={{ margin: '0 10px' }} variant='contained'>
          {SHOW}
        </Button>
      )}
      {showPendingButton && (
        <Button color='main' onClick={handlePending} variant='contained'>
          {PENDING}
        </Button>
      )}
      <Button
        disabled={!editing || !hasModifiedState({ initialState, stagedState })}
        onClick={handleSave}
        variant='contained'
      >
        {SAVE}
      </Button>
    </Box>
  )
}

export default ConceptEditingActions
