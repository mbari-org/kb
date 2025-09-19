import { use } from 'react'

import UserContext from '@/contexts/user/UserContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

import createCsvExport from '@/lib/csvExport'
import { conceptNameForFilename } from '@/lib/utils'

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
  const { user } = use(UserContext)
  const { setExporting } = use(PanelDataContext)

  return (references, byConceptName) => createCsvExport({
    comments: buildComments(byConceptName),
    count: references.length,
    getData: () => dataRows(references),
    headers: dataHeaders,
    onProgress: setExporting,
    paginated: false,
    suggestedName: () => `KB-References_${byConceptName ? conceptNameForFilename(byConceptName) : 'all'}.csv`,
    title: 'Knowledge Base References',
    user,
  })()
}

export default useReferencesExport
