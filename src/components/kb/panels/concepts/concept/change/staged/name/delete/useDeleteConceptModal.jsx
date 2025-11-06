import { use, useCallback } from 'react'

import ConceptTitle from '@/components/common/ConceptTitle'
import DeleteConceptContent from './DeleteConceptContent'
import DeleteConceptActions from './DeleteConceptActions'

import { createModal } from '@/components/modal/conceptModalFactory'
import { relatedDataCounts } from '../relatedDataCounts'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

const useDeleteConceptModal = () => {
  const { apiFns } = use(ConfigContext)
  const { concept } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)
  const { getReferences } = use(PanelDataContext)

  const deleteConceptModal = useCallback(async () => {
    const modal = createModal({
      Actions: DeleteConceptActions,
      Content: DeleteConceptContent,
      Title: ConceptTitle,
      minWidth: 600,
    })
    setModal(modal)

    const counts = await relatedDataCounts({
      apiFns,
      concept,
      getReferences,
    })

    setModalData(prev => ({
      ...prev,
      alert: null,
      isLoading: false,
      isValid: true,
      modified: true,
      reassign: concept.parent,
      relatedDataCounts: counts,
    }))
  }, [apiFns, concept, getReferences, setModal, setModalData])

  return deleteConceptModal
}

export default useDeleteConceptModal
