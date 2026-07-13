import { use, useCallback, useState } from 'react'

import createAppModal from '@/components/modal/app/createAppModal'
import ExportCompleteActions from '@/components/kb/export/ExportCompleteActions'
import ExportCompleteContent from '@/components/kb/export/ExportCompleteContent'
import ExportCompleteTitle from '@/components/kb/export/ExportCompleteTitle'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'

import csvExport from '@/lib/csvExport'
import { conceptNameForFilename } from '@/lib/utils'

import { SELECTED } from '@/lib/constants/selected.js'
import CONFIG from '@/text'

const { PROCESSING } = CONFIG

const dataHeaders = ['Link Name', 'To Concept', 'Link Value']
const dataRows = realizations => realizations.map(realization => [realization.linkName, realization.toConcept, realization.linkValue])

const buildComments = conceptName => {
  const comments = []
  if (conceptName) {
    comments.push(`Concept: ${conceptName}`)
  }
  return comments
}

const useRealizationsExport = () => {
  const { stagedState } = use(ConceptContext)
  const { getSelected } = use(SelectedContext)
  const { user } = use(UserContext)
  const { beginProcessing, setModal, setModalData } = use(AppModalContext)
  const [processingStop, setProcessingStop] = useState(null)

  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const realizations = stagedState?.realizations || []

  const suggestName = () => {
    const conceptName = selectedConcept ? `_${conceptNameForFilename(selectedConcept)}` : ''
    return `KB-Realizations${conceptName}.csv`
  }

  const onProgress = useCallback(
    value => {
      if (value === false) {
        if (processingStop) {
          processingStop()
          setProcessingStop(null)
        }
      } else if (value?.status === 'done' && value.fileName) {
        if (processingStop) {
          processingStop()
          setProcessingStop(null)
        }
        const modal = createAppModal({
          Actions: ExportCompleteActions,
          Content: ExportCompleteContent,
          Title: ExportCompleteTitle,
          minWidth: 420,
          focusClose: true,
        })
        setModalData({ fileName: value.fileName })
        setModal(modal)
      } else if (typeof value === 'string') {
        if (!processingStop) {
          setProcessingStop(() => beginProcessing(PROCESSING.LOAD, value))
        } else if (processingStop.updateMessage) {
          processingStop.updateMessage(value)
        }
      }
    },
    [processingStop, beginProcessing, setModal, setModalData]
  )

  return csvExport({
    comments: buildComments(selectedConcept),
    count: realizations.length,
    getData: () => dataRows(realizations),
    headers: dataHeaders,
    onProgress,
    paginated: false,
    suggestName,
    title: 'Knowledge Base Realizations',
    user,
  })
}

export default useRealizationsExport
