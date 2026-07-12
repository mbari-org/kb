import { use, useCallback, useState } from 'react'

import createAppModal from '@/components/modal/app/createAppModal'
import ExportCompleteActions from '@/components/kb/export/ExportCompleteActions'
import ExportCompleteContent from '@/components/kb/export/ExportCompleteContent'
import ExportCompleteTitle from '@/components/kb/export/ExportCompleteTitle'
import useFilteredReferences from '@/components/kb/panels/references/useFilteredReferences'

import AppModalContext from '@/contexts/app/AppModalContext'
import UserContext from '@/contexts/user/UserContext'

import csvExport from '@/lib/csvExport'
import { conceptNameForFilename } from '@/lib/utils'

import CONFIG from '@/text'

const { PROCESSING } = CONFIG

const dataHeaders = ['DOI', 'Citation', 'Concepts']

const dataRows = references => references.map(reference => [reference.doi, reference.citation, reference.concepts])

const buildComments = byConceptName => {
  const comments = []
  if (byConceptName) {
    comments.push(`Concept: ${byConceptName}`)
  }
  return comments
}

const useReferencesExport = () => {
  const { filteredReferences, selectedConcept } = useFilteredReferences()
  const { user } = use(UserContext)
  const { beginProcessing, setModal, setModalData } = use(AppModalContext)
  const [processingStop, setProcessingStop] = useState(null)

  const suggestName = () => {
    const conceptName = selectedConcept ? `_${conceptNameForFilename(selectedConcept)}` : ''
    return `KB-References${conceptName}.csv`
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
    count: filteredReferences.length,
    getData: () => dataRows(filteredReferences),
    headers: dataHeaders,
    onProgress,
    paginated: false,
    suggestName,
    title: 'Knowledge Base References',
    user,
  })
}

export default useReferencesExport
