import { use, useCallback } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import useStagedStateDisplay from '@/contexts/concept/lib/edit/useStagedStateDisplay'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'
import LABELS from '@/components/kb/panels/concepts/stagedState/labels'

const { DISCARD, DISCARD_ALL } = LABELS.ACTION
const { CANCEL, EDIT, SAVE, SHOW } = LABELS.CONCEPT.ACTION
const { CONFIRMED, TO_INITIAL } = CONCEPT_STATE.RESET

const ConceptEditingActions = () => {
  const { editing, isModified, modifyConcept, setEditing } = use(ConceptContext)

  const stagedStateDiscard = useStagedStateDisplay(DISCARD)
  const stagedStateSave = useStagedStateDisplay(SAVE)
  const stagedStateShow = useStagedStateDisplay(SHOW)

  const handleDiscard = useCallback(() => {
    if (isModified()) {
      modifyConcept({ type: TO_INITIAL })
      stagedStateDiscard()
    } else {
      setEditing(false)
    }
  }, [isModified, modifyConcept, stagedStateDiscard, setEditing])

  const handleSave = useCallback(() => {
    modifyConcept({ type: CONFIRMED.NO })
    stagedStateSave()
  }, [modifyConcept, stagedStateSave])

  const handleShow = useCallback(() => {
    modifyConcept({ type: CONFIRMED.NO })
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
        {editing ? (isModified() ? DISCARD_ALL : CANCEL) : EDIT}
      </Button>
      {editing && isModified() && (
        <Button onClick={handleShow} sx={{ margin: '0 10px' }} variant='contained'>
          {SHOW}
        </Button>
      )}
      <Button disabled={!editing || !isModified()} onClick={handleSave} variant='contained'>
        {SAVE}
      </Button>
    </Box>
  )
}

export default ConceptEditingActions
