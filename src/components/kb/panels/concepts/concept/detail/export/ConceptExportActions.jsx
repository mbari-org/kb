import { use } from 'react'

import Actions from '@/components/modal/actions/Actions'

import useConceptExportCsv from './useConceptExportCsv'
import useConceptExportJson from './useConceptExportJson'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { EXPORT_TYPE } from '@/lib/constants/exportType.js'
import CONFIG from '@/text'

const { CANCEL } = CONFIG.PANELS.CONCEPTS.BUTTON
const { EXPORT } = CONFIG.PANELS.CONCEPTS.EXPORT.BUTTON
const ConceptExportActions = () => {
  const { closeModal, modalData } = use(ConceptModalContext)

  const exportCsv = useConceptExportCsv(modalData.conceptExtent)
  const exportJson = useConceptExportJson(modalData.conceptExtent)

  const handleAction = action => {
    switch (action) {
      case CANCEL: {
        closeModal()
        break
      }
      case EXPORT: {
        if (modalData.exportType === EXPORT_TYPE.JSON) {
          exportJson()
        } else {
          exportCsv()
        }
        closeModal()
        break
      }
    }
  }

  return (
    <Actions
      colors={['cancel', 'main']}
      disabled={[false, false]}
      labels={[CANCEL, EXPORT]}
      onAction={handleAction}
    />
  )
}

export default ConceptExportActions