import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptModalContext from '@/contexts/modal/ConceptModalContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import commitStaged from './commitStaged'

const useSaveStaged = () => {
  const { closeModal, setProcessing } = use(ConceptModalContext)
  const { apiFns } = use(ConfigContext)
  const { concept, initialState, stagedState } = use(ConceptContext)

  return useCallback(async () => {
    try {
      setProcessing('Saving concept...')
      await commitStaged(apiFns.apiPayload, concept, initialState, stagedState)
      closeModal()
    } catch (error) {
      console.error('Error saving concept:', error)
      setProcessing(null)
    }
  }, [apiFns, closeModal, concept, initialState, setProcessing, stagedState])
}

export default useSaveStaged
