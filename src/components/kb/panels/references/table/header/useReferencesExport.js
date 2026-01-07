import { use, useCallback, useState } from 'react'

import AppModalContext from '@/contexts/app/AppModalContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'

import csvExport from '@/lib/csvExport'
import { conceptNameForFilename } from '@/lib/utils'

import CONFIG from '@/text'
import { SELECTED } from '@/lib/constants/selected.js'

const { PROCESSING } = CONFIG

const { REFERENCES } = SELECTED.SETTINGS

const dataHeaders = ['DOI', 'Citation', 'Concepts']

const dataRows = references =>
  references.map(reference => [reference.doi, reference.citation, reference.concepts])

const buildComments = byConceptName => {
  const comments = []
  if (byConceptName) {
    comments.push(`Concept: ${byConceptName}`)
  }
  return comments
}

const useReferencesExport = () => {
  const { getReferences } = use(PanelDataContext)
  const { getSelected, getSettings } = use(SelectedContext)
  const { user } = use(UserContext)
  const { beginProcessing } = use(AppModalContext)
  const [processingStop, setProcessingStop] = useState(null)

  const byConcept = getSettings(REFERENCES.KEY, REFERENCES.BY_CONCEPT)
  const selectedConcept = byConcept ? getSelected(SELECTED.CONCEPT) : null

  const references = getReferences(selectedConcept)

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
      } else if (typeof value === 'string') {
        if (!processingStop) {
          setProcessingStop(() => beginProcessing(PROCESSING.LOAD, value))
        } else if (processingStop.updateMessage) {
          processingStop.updateMessage(value)
        }
      }
    },
    [processingStop, beginProcessing]
  )

  return csvExport({
    comments: buildComments(selectedConcept),
    count: references.length,
    getData: () => dataRows(references),
    headers: dataHeaders,
    onProgress,
    paginated: false,
    suggestName,
    title: 'Knowledge Base References',
    user,
  })
}

export default useReferencesExport
