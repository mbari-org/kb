/**
 * Concept Modal Utilities
 * Consolidates common patterns used across concept modal components
 */

import { createActions } from '@/components/modal/conceptModalFactory'
import { RESETTING } from '@/lib/constants'

import CONFIG from '@/lib/config'

const { BACK_TO_EDITING, CONFIRM, DISCARD, STAGE } = CONFIG.BUTTON
const { CONFIRMED } = RESETTING

export const createStagedActions = ({
  closeModal,
  confirmReset = false,
  modifyConcept,
  name = 'StagedActions',
  onConfirm,
  onContinue,
  onDiscard,
  onStage,
  stageDisabled = false,
}) => {
  const colors = ['cancel', 'main']
  const disabled = [false, stageDisabled]
  const labels = confirmReset ? [CONFIRM, BACK_TO_EDITING] : [DISCARD, STAGE]

  const handleConfirm =
    onConfirm ||
    (() => {
      modifyConcept?.({ type: CONFIRMED.YES, update: {} })
      closeModal?.(true)
    })

  const handleContinue = onContinue || (() => modifyConcept?.({ type: CONFIRMED.NO }))
  const handleDiscard = onDiscard || (() => closeModal?.())

  const onAction = async label => {
    switch (label) {
      case CONFIRM:
        await handleConfirm()
        break

      case BACK_TO_EDITING:
        await handleContinue()
        break

      case DISCARD:
        await handleDiscard()
        break

      case STAGE:
        await onStage()
        break

      default:
        throw new Error(`Invalid staged action label: ${label}`)
    }
  }

  return createActions({ colors, disabled, labels, onAction }, name)
}

export const createConfirmationHandlers = ({ closeModal, modifyConcept }) => {
  const handleConfirm = (update = {}) => {
    modifyConcept({
      type: CONFIRMED.YES,
      update,
    })
    closeModal(true)
  }

  const handleContinue = () => {
    modifyConcept({ type: CONFIRMED.NO })
  }

  const handleDiscard = () => {
    closeModal()
  }

  return {
    handleConfirm,
    handleContinue,
    handleDiscard,
  }
}

export const createStageDiscardHandlers = ({ closeModal, modifyConcept, stageAction }) => {
  const handleDiscard = () => closeModal()

  const handleStage = () => {
    if (stageAction) {
      modifyConcept(stageAction)
    }
    closeModal()
  }

  return {
    handleDiscard,
    handleStage,
  }
}

export const validateChildName = (childName, existingNames, stagedChildren) => {
  if (!childName || childName.trim() === '') {
    return false
  }

  return !existingNames.includes(childName) && !stagedChildren.some(stagedChild => stagedChild.name === childName)
}

export const validateNameChange = (newName, currentName, existingNames) => {
  if (!newName || newName.trim() === '') {
    return false
  }

  if (newName === currentName) {
    return false // No change
  }

  return !existingNames.includes(newName)
}

export const validateConceptInput = (input, existingNames = [], omitChoices = []) => {
  const trimmed = (input || '').trim()
  if (!trimmed) {
    return false
  }

  return existingNames.filter(name => !omitChoices.includes(name)).includes(trimmed)
}
