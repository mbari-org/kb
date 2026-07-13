import { use, useCallback, useState } from 'react'

import createAppModal from '@/components/modal/app/createAppModal'
import ExportCompleteActions from '@/components/kb/export/ExportCompleteActions'
import ExportCompleteContent from '@/components/kb/export/ExportCompleteContent'
import ExportCompleteTitle from '@/components/kb/export/ExportCompleteTitle'
import useFilteredReferences from '@/components/kb/panels/references/useFilteredReferences'

import AppModalContext from '@/contexts/app/AppModalContext'
import UserContext from '@/contexts/user/UserContext'

import csvExport from '@/lib/csvExport'
import { capitalize, conceptNameForFilename } from '@/lib/utils'
import { CONCEPT } from '@/lib/constants'

import CONFIG from '@/text'

const { PROCESSING } = CONFIG

const dataHeaders = ['DOI', 'Citation', 'Concepts']

const dataRows = references => references.map(reference => [reference.doi, reference.citation, reference.concepts])

const buildComments = ({ conceptExtent, byConceptName }) => {
  const comments = []
  if (byConceptName) {
    comments.push(`Concept: ${byConceptName}`)
    comments.push(`Extent: ${capitalize(conceptExtent)}`)
  }
  return comments
}

const useReferencesExport = () => {
  const { conceptExtent, filteredReferences, selectedConcept } = useFilteredReferences()
  const { user } = use(UserContext)
  const { beginProcessing, setModal, setModalData } = use(AppModalContext)
  const [processingStop, setProcessingStop] = useState(null)

  const suggestName = () => {
    const conceptName = selectedConcept ? `_${conceptNameForFilename(selectedConcept)}` : ''
    const extent = selectedConcept && conceptExtent !== CONCEPT.EXTENT.SOLO ? `_and_${conceptExtent}` : ''
    return `KB-References${conceptName}${extent}.csv`
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
    comments: buildComments({ byConceptName: selectedConcept, conceptExtent }),
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
