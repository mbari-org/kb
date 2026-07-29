import { use, useCallback, useState } from 'react'

import createAppModal from '@/components/modal/app/createAppModal'
import ExportCompleteActions from '@/components/kb/export/ExportCompleteActions'
import ExportCompleteContent from '@/components/kb/export/ExportCompleteContent'
import ExportCompleteTitle from '@/components/kb/export/ExportCompleteTitle'

import AppModalContext from '@/contexts/app/AppModalContext'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import UserContext from '@/contexts/user/UserContext'

import csvExport from '@/lib/csvExport'
import { conceptNameForFilename, humanTimestamp } from '@/lib/utils'

import { SELECTED } from '@/lib/constants/selected.js'
import CONFIG from '@/lib/config'

const { PROCESSING } = CONFIG

const { REALIZATIONS } = SELECTED.SETTINGS

const dataHeaders = ['Concept', 'Link Name', 'To Concept', 'Link Value', 'Last Updated']
const dataRows = realizations =>
  realizations.map(realization => [
    realization.concept,
    realization.linkName,
    realization.toConcept,
    realization.linkValue,
    humanTimestamp(realization.lastUpdated),
  ])

const buildComments = filters => {
  const comments = []
  filters[REALIZATIONS.FILTERS.CONCEPT] && comments.push(`Concept: ${filters[REALIZATIONS.FILTERS.CONCEPT]}`)
  filters[REALIZATIONS.FILTERS.LINK_NAME] && comments.push(`Link Name: ${filters[REALIZATIONS.FILTERS.LINK_NAME]}`)
  filters[REALIZATIONS.FILTERS.TO_CONCEPT] && comments.push(`To Concept: ${filters[REALIZATIONS.FILTERS.TO_CONCEPT]}`)
  filters[REALIZATIONS.FILTERS.LINK_VALUE] && comments.push(`Link Value: ${filters[REALIZATIONS.FILTERS.LINK_VALUE]}`)
  return comments
}

const useRealizationsExport = () => {
  const { filteredRealizations, filters } = use(RealizationsContext)
  const { user } = use(UserContext)
  const { beginProcessing, setModal, setModalData } = use(AppModalContext)
  const [processingStop, setProcessingStop] = useState(null)
  const realizations = filteredRealizations || []

  const suggestName = () => {
    const selectedConcept = filters[REALIZATIONS.FILTERS.CONCEPT]
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
    comments: buildComments(filters),
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
