import { use } from 'react'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'

import csvExport from '@/lib/csvExport'
import { conceptNameForFilename } from '@/lib/utils'

import { SELECTED } from '@/lib/constants/selected.js'

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
  const { getReferences, setExporting } = use(PanelDataContext)
  const { getSelected, getSettings } = use(SelectedContext)
  const { user } = use(UserContext)

  const byConcept = getSettings(REFERENCES.KEY, REFERENCES.BY_CONCEPT)
  const selectedConcept = byConcept ? getSelected(SELECTED.CONCEPT) : null

  const references = getReferences(selectedConcept)

  const suggestName = () => {
    const conceptName = selectedConcept ? `_${conceptNameForFilename(selectedConcept)}` : ''
    return `KB-References${conceptName}.csv`
  }

  return csvExport({
    comments: buildComments(selectedConcept),
    count: references.length,
    getData: () => dataRows(references),
    headers: dataHeaders,
    onProgress: setExporting,
    paginated: false,
    suggestName,
    title: 'Knowledge Base References',
    user,
  })
}

export default useReferencesExport
