import { use, useCallback } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import useStagedStateDisplay from '@/contexts/concept/lib/edit/useStagedStateDisplay'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { INTENT } from '@/contexts/concept/lib/edit/useStagedStateDisplay'
import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'
const ConceptEditingActions = () => {
  const { editing, isModified, modifyConcept, setEditing } = use(ConceptContext)

  const stagedStateDiscard = useStagedStateDisplay(INTENT.DISCARD)
  const stagedStateSave = useStagedStateDisplay(INTENT.SAVE)
  const stagedStateShow = useStagedStateDisplay(INTENT.SHOW)

  const handleDiscard = useCallback(() => {
    if (isModified()) {
      modifyConcept({ type: CONCEPT_STATE.RESET.TO_INITIAL })
      stagedStateDiscard()
    } else {
      setEditing(false)
    }
  }, [isModified, modifyConcept, stagedStateDiscard, setEditing])

  const handleSave = useCallback(() => {
    modifyConcept({ type: CONCEPT_STATE.RESET.CONFIRMED.NO })
    stagedStateSave()
  }, [modifyConcept, stagedStateSave])

  const handleShow = useCallback(() => {
    modifyConcept({ type: CONCEPT_STATE.RESET.CONFIRMED.NO })
    stagedStateShow()
  }, [modifyConcept, stagedStateShow])

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
        onClick={() => {
          editing ? (isModified() ? handleDiscard() : setEditing(false)) : setEditing(true)
        }}
        variant='contained'
      >
        {editing ? (isModified() ? 'Discard All' : 'Cancel') : 'Edit'}
      </Button>
      {editing && isModified() && (
        <Button onClick={handleShow} sx={{ margin: '0 10px' }} variant='contained'>
          {INTENT.SHOW}
        </Button>
      )}
      <Button disabled={!editing || !isModified()} onClick={handleSave} variant='contained'>
        {INTENT.SAVE}
      </Button>
    </Box>
  )
}

export default ConceptEditingActions
