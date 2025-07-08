/**
 * Concept Modal Utilities
 * Consolidates common patterns used across concept modal components
 */

import { createActions } from '@/components/modal/conceptModalFactory'
import { CONCEPT_STATE, LABELS } from '@/lib/constants'

const { CONFIRM_DISCARD, CONTINUE, DISCARD, STAGE } = LABELS.BUTTON
const { CONFIRMED } = CONCEPT_STATE.RESET

/**
 * Creates standard action configuration for concept modals
 * @param {Object} config - Action configuration
 * @param {Function} config.onDiscard - Called when discard is clicked
 * @param {Function} config.onStage - Called when stage is clicked
 * @param {boolean} config.stageDisabled - Whether stage button is disabled
 * @param {boolean} config.confirmReset - Whether in confirmation reset mode
 * @param {Function} config.onConfirmDiscard - Called when confirm discard is clicked
 * @param {Function} config.onContinue - Called when continue is clicked
 * @param {string} config.name - Component name for debugging
 * @returns {Component} Actions component
 */
export const createStagedActions = ({
  onDiscard,
  onStage,
  stageDisabled = false,
  confirmReset = false,
  onConfirmDiscard,
  onContinue,
  name = 'ConceptActions',
}) => {
  const colors = ['cancel', 'main']
  const disabled = [false, stageDisabled]
  const labels = confirmReset ? [CONFIRM_DISCARD, CONTINUE] : [DISCARD, STAGE]

  const onAction = label => {
    switch (label) {
      case CONFIRM_DISCARD:
        onConfirmDiscard()
        break
      case CONTINUE:
        onContinue()
        break
      case DISCARD:
        onDiscard()
        break
      case STAGE:
        onStage()
        break
    }
  }

  return createActions({ colors, disabled, labels, onAction }, name)
}

/**
 * Creates handlers for confirmation reset flow (when confirmReset is active)
 * @param {Object} config - Handler configuration
 * @param {Function} config.modifyConcept - Modify concept function
 * @param {Function} config.closeModal - Close modal function
 * @param {Object} config.concept - Current concept
 * @returns {Object} Confirmation handlers
 */
export const createConfirmationHandlers = ({ modifyConcept, closeModal, concept }) => {
  const handleConfirmDiscard = (update = {}) => {
    modifyConcept({
      type: CONFIRMED.YES,
      update: { name: concept.name, ...update },
    })
    closeModal(true) // Force close, bypassing onClose
  }

  const handleContinue = () => {
    modifyConcept({ type: CONFIRMED.NO })
  }

  const handleDiscard = () => {
    closeModal() // Let onClose handle any reset logic
  }

  return {
    handleConfirmDiscard,
    handleContinue,
    handleDiscard,
  }
}

/**
 * Creates handlers for basic stage/discard flow
 * @param {Object} config - Configuration
 * @param {Function} config.modifyConcept - Modify concept function
 * @param {Function} config.closeModal - Close modal function
 * @param {Object} config.stageAction - Action to dispatch when staging
 * @returns {Object} Basic action handlers
 */
export const createStageDiscardHandlers = ({ modifyConcept, closeModal, stageAction }) => {
  const handleDiscard = () => {
    closeModal()
  }

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

/**
 * Validates child concept name
 * @param {string} childName - Child name to validate
 * @param {Array<string>} existingNames - Existing concept names
 * @param {Array<Object>} stagedChildren - Currently staged children
 * @returns {boolean} Whether the child name is valid
 */
export const validateChildName = (childName, existingNames, stagedChildren) => {
  if (!childName || childName.trim() === '') {
    return false
  }

  return (
    !existingNames.includes(childName) &&
    !stagedChildren.some(stagedChild => stagedChild.name === childName)
  )
}

/**
 * Validates concept name change
 * @param {string} newName - New name to validate
 * @param {string} currentName - Current concept name
 * @param {Array<string>} existingNames - Existing concept names
 * @returns {boolean} Whether the name change is valid
 */
export const validateNameChange = (newName, currentName, existingNames) => {
  if (!newName || newName.trim() === '') {
    return false
  }

  if (newName === currentName) {
    return false // No change
  }

  return !existingNames.includes(newName)
}
