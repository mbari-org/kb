import { use, useCallback, useMemo } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import useDisplayPending from '@/components/kb/panels/concepts/concept/change/pending/modal/useDisplayPending'
import useDisplayStaged from '@/components/kb/panels/concepts/concept/change/staged/modal/useDisplayStaged'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import UserContext from '@/contexts/user/UserContext'

import { isReadOnly } from '@/lib/auth/role'

import { isStateModified } from '@/lib/concept/state/state'
import { pendingChild } from '@/lib/model/history'

import { RESETTING } from '@/lib/constants'
import { PENDING } from '@/lib/constants/pending.js'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import CONFIG from '@/text'

const { BUTTON } = CONFIG.PANELS.CONCEPTS
const { DISCARD, DISCARD_ALL, CANCEL, EDIT, PENDING: PENDING_ACTION, SAVE, STAGED } = BUTTON
const { TO_INITIAL } = CONCEPT_STATE.RESET
const { CONFIRMED } = RESETTING

const ConceptEditingActions = () => {
  const { concept, isEditing, initialState, modifyConcept, pending, setEditing, stagedState } =
    use(ConceptContext)
  const { user } = use(UserContext)
  const readonly = isReadOnly(user)

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
      <Button
        color={isEditing ? 'cancel' : 'main'}
        disabled={readonly}
        onClick={handleCancelDiscard}
        variant='contained'
      >
        {editCancelDiscardButtonText}
      </Button>
      {isEditing && isModified && (
        <Button disabled={readonly} onClick={handleStaged} sx={{ margin: '0 10px' }} variant='contained'>
          {STAGED}
        </Button>
      )}
      {showPendingButton && (
        <Button color='main' disabled={readonly} onClick={handlePending} variant='contained'>
          {PENDING_ACTION}
        </Button>
      )}
      <Button disabled={readonly || !isEditing || !isModified} onClick={handleSave} variant='contained'>
        {SAVE}
      </Button>
    </Box>
  )
}

export default ConceptEditingActions
