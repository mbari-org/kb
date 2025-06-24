import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import AppModalContext from '@/contexts/modal/AppModalContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import commitStaged from './commitStaged'

const useSaveStaged = () => {
  const { closeModal, setProcessing } = use(AppModalContext)
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
