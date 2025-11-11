import { use, useCallback } from 'react'

import ConceptTitle from '@/components/common/ConceptTitle'
import ConceptExportActions from './ConceptExportActions'
import ConceptExportContent from './ConceptExportContent'

import { createModal } from '@/components/modal/conceptModalFactory'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { CONCEPT_EXTENT, EXPORT_TYPE } from '@/lib/constants/constants'

const initialModalData = {
  conceptExtent: CONCEPT_EXTENT.DESCENDANTS,
  exportType: EXPORT_TYPE.CSV,
  validInput: true,
}

const conceptExportModal = () => {
  const components = {
    Actions: ConceptExportActions,
    Content: ConceptExportContent,
    Title: ConceptTitle,
    minWidth: 500,
  }
  return createModal(components)
}

const useConceptExportModal = () => {
  const { setModal, setModalData } = use(ConceptModalContext)

  return useCallback(() => {
    const modal = conceptExportModal()
    setModal(modal)

    setModalData(initialModalData)
  }, [setModal, setModalData])
}

export default useConceptExportModal