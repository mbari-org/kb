import { use } from 'react'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'

import csvExport from '@/lib/csvExport'
import { conceptNameForFilename } from '@/lib/utils'

import { SELECTED } from '@/lib/constants'

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
  const { references } = use(ReferencesContext)
  const { getSelected, getSettings } = use(SelectedContext)
  const { user } = use(UserContext)
  const { setExporting } = use(PanelDataContext)

  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const byConcept = getSettings(REFERENCES.KEY, REFERENCES.BY_CONCEPT)
  const byConceptName = byConcept ? selectedConcept : null

  const suggestName = () => {
    const conceptName = byConceptName ? `_${conceptNameForFilename(byConceptName)}` : ''
    return `KB-References${conceptName}.csv`
  }

  const filteredReferences = byConcept
    ? references.filter(reference => reference.concepts.includes(selectedConcept))
    : references

  return csvExport({
    comments: buildComments(byConceptName),
    count: filteredReferences.length,
    getData: () => dataRows(filteredReferences),
    headers: dataHeaders,
    onProgress: setExporting,
    paginated: false,
    suggestName,
    title: 'Knowledge Base References',
    user,
  })
}

export default useReferencesExport
