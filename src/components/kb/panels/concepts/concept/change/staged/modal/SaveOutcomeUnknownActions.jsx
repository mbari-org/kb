import { useErrorBoundary } from 'react-error-boundary'

import { createActions } from '@/components/modal/conceptModalFactory'

import useReloadConcept from '@/contexts/panels/concepts/staged/save/useReloadConcept'

import CONFIG from '@/lib/config'

const { RELOAD } = CONFIG.BUTTON

const SaveOutcomeUnknownActions = () => {
  const { showBoundary } = useErrorBoundary()
  const reloadConcept = useReloadConcept()

  const onAction = async label => {
    switch (label) {
      case RELOAD:
        try {
          await reloadConcept()
        } catch (error) {
          showBoundary(error)
        }
        break

      default:
        throw new Error(`Invalid save outcome action: ${label}`)
    }
  }

  return createActions({ labels: [RELOAD], onAction }, 'SaveOutcomeUnknownActions')
}

export default SaveOutcomeUnknownActions
