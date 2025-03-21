import { use, useCallback, useMemo } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import useStagedStateDisplay from '@/contexts/concept/lib/edit/useStagedStateDisplay'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'
import { hasModifiedState } from '@/lib/kb/concept'

import LABELS from '@/components/kb/panels/concepts/stagedState/labels'

const { DISCARD, DISCARD_ALL } = LABELS.ACTION
const { CANCEL, EDIT, SAVE, SHOW } = LABELS.CONCEPT.ACTION
const { CONFIRMED, TO_INITIAL } = CONCEPT_STATE.RESET

const ConceptEditingActions = () => {
  const { editing, initialState, modifyConcept, setEditing, stagedState } = use(ConceptContext)

  const stagedStateDiscard = useStagedStateDisplay(DISCARD)
  const stagedStateSave = useStagedStateDisplay(SAVE)
  const stagedStateShow = useStagedStateDisplay(SHOW)

  const handleSave = useCallback(() => {
    modifyConcept({ type: CONFIRMED.NO })
    stagedStateSave()
  }, [modifyConcept, stagedStateSave])

  const handleShow = useCallback(() => {
    modifyConcept({ type: CONFIRMED.NO })
    stagedStateShow()
  }, [modifyConcept, stagedStateShow])

  const handleEditCancelDiscard = useCallback(() => {
    if (!editing) {
      setEditing(true)
    } else if (!hasModifiedState({ initialState, stagedState })) {
      setEditing(false)
    } else {
      modifyConcept({ type: TO_INITIAL })
      stagedStateDiscard()
    }
  }, [editing, initialState, modifyConcept, stagedState, stagedStateDiscard, setEditing])

  const editCancelDiscardButtonText = useMemo(() => {
    if (!editing) return EDIT
    if (hasModifiedState({ initialState, stagedState })) return DISCARD_ALL
    return CANCEL
  }, [editing, initialState, stagedState])

  return (
    <Box
      sx={{
        alignItems: 'center',
        bottom: 65,
        display: 'flex',
        justifyContent: 'space-between',
        left: 10,
        position: 'absolute',
        right: 15,
      }}
    >
      <Button
        color={editing ? 'cancel' : 'main'}
        onClick={handleEditCancelDiscard}
        variant='contained'
      >
        {editCancelDiscardButtonText}
      </Button>
      {editing && hasModifiedState({ initialState, stagedState }) && (
        <Button onClick={handleShow} sx={{ margin: '0 10px' }} variant='contained'>
          {SHOW}
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
