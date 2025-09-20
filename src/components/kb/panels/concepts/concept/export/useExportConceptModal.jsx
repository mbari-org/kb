import { use, useCallback } from 'react'

import ConceptTitle from '@/components/common/ConceptTitle'

import ExportConceptActions from './ExportConceptActions'
import ExportConceptContent from './ExportConceptContent'

import { createModal } from '@/components/modal/conceptModalFactory'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

const exportConceptModal = () => {
  const components = {
    Actions: ExportConceptActions,
    Content: ExportConceptContent,
    Title: ConceptTitle,
    minWidth: 500,
  }
  return createModal(components)
}

const useExportConceptModal = () => {
  const { setModal } = use(ConceptModalContext)

  return useCallback(() => {
    const modal = exportConceptModal()
    setModal(modal)
  }, [setModal])
}

export default useExportConceptModal