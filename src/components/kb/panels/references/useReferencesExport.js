import { use } from 'react'

import { getReferences } from '@/lib/api/references'

import ConfigContext from '@/contexts/config/ConfigContext'

import { escapeCSV, writeCSVContent } from '@/lib/util'

const referenceDataHeaders = ['DOI', 'Citation', 'Concepts']

const referenceRows = references =>
  references.map(reference => [reference.doi, reference.citation, reference.concepts])

const useReferencesExport = () => {
  const { apiFns } = use(ConfigContext)

  const referencesExport = async () => {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'KB-References.csv',
        types: [
          {
            description: 'CSV Files',
            accept: { 'text/csv': ['.csv'] },
          },
        ],
      })

      const references = await apiFns.apiPaginated(getReferences)

      const writable = await handle.createWritable()
      await writable.write(referenceDataHeaders.map(escapeCSV).join(',') + '\n')

      await writeCSVContent(writable, referenceRows(references))
      await writable.close()
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error saving file:', error)
      }
    }
  }

  return referencesExport
}

export default useReferencesExport
