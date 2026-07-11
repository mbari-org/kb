import { use, useCallback } from 'react'

import ConceptTitle from '@/components/common/ConceptTitle'
import ChangeNameActions from './ChangeNameActions'
import ChangeNameContent from './ChangeNameContent'

import { relatedDataCounts } from '@/components/kb/panels/concepts/concept/change/staged/name/relatedDataCounts'
import { createModal } from '@/components/modal/conceptModalFactory'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import CONFIG from '@/text'

const { NAME } = CONCEPT_STATE
const { TEMPLATES_DEFINED } = CONFIG.PANELS.CONCEPTS.MODALS.STRUCTURE.CHANGE_NAME.RELATED_DATA_COUNTS

const useChangeNameModal = () => {
  const { apiFns } = use(ConfigContext)
  const { concept, modifyConcept, initialState } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)
  const { getReferences } = use(PanelDataContext)

  const onClose = useCallback(
    modalData => {
      const { name } = modalData
      if (name?.value !== concept.name) {
        modifyConcept({
          type: CONCEPT_STATE.RESET.NAME,
          update: { name: initialState.name },
        })
        return false
      }
      return true
    },
    [concept.name, initialState.name, modifyConcept]
  )

  const changeNameModal = useCallback(async () => {
    const modal = createModal({
      Actions: ChangeNameActions,
      Content: ChangeNameContent,
      Title: ConceptTitle,
      minWidth: 600,
    })
    setModal(modal, onClose)

    const counts = await relatedDataCounts({
      apiFns,
      concept,
      getReferences,
    })
    const hasRelatedData = counts
      .filter(count => count.title !== TEMPLATES_DEFINED)
      .some(count => count.value > 0)

    setModalData(prev => ({
      ...prev,
      action: NAME,
      alert: null,
      hasRelatedData,
      isLoading: false,
      isValid: true,
      modified: false,
      name: { value: concept.name, extent: '' },
      relatedDataCounts: counts,
    }))
  }, [apiFns, concept, getReferences, setModal, setModalData, onClose])

  return changeNameModal
}

export default useChangeNameModal
