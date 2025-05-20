import { use, useCallback } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import ModalContext from '@/contexts/modal/ModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import commitStaged from '@/contexts/concept/staged/save/commitStaged'
import { PROCESSING } from '@/lib/constants'

const { SAVING } = PROCESSING

const useSaveStaged = () => {
  const { apiFns } = use(ConfigContext)
  const { concept, initialState, refreshConcept, setEditing, stagedState } = use(ConceptContext)
  const { closeModal, setProcessing } = use(ModalContext)
  const { selectConcept } = use(SelectedContext)
  const { refreshConcept: refreshTaxonomyConcept } = use(TaxonomyContext)

  const saveStaged = useCallback(async () => {
    closeModal()
    setProcessing(SAVING)

    try {
      const updateInfo = await commitStaged(apiFns.apiPayload, concept, initialState, stagedState)
      const updatedConcept = await refreshTaxonomyConcept(concept, updateInfo)
      setEditing(false)
      setProcessing(null)
      updateInfo.hasUpdated('name')
        ? selectConcept(updatedConcept.name)
        : refreshConcept(updatedConcept)
    } catch (error) {
      setProcessing(null)
      console.error('Error saving staged changes:', error)
    }
  }, [
    apiFns.apiPayload,
    concept,
    initialState,
    stagedState,
    refreshTaxonomyConcept,
    setEditing,
    setProcessing,
    selectConcept,
    refreshConcept,
    closeModal,
  ])

  return saveStaged
}

export default useSaveStaged
