import { csvHeaders, csvOut } from '@/lib/csv'
import { conceptNameForFilename } from '@/lib/utils'

const referenceDataHeaders = ['DOI', 'Citation', 'Concepts']

const referenceRows = references =>
  references.map(reference => [reference.doi, reference.citation, reference.concepts])

const useReferencesExport = () => {
  const referencesExport = async (references, byConceptName) => {
    const suggestName = `KB-References_${
      byConceptName ? conceptNameForFilename(byConceptName) : 'all'
    }.csv`

    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: suggestName,
        types: [
          {
            description: 'CSV Files',
            accept: { 'text/csv': ['.csv'] },
          },
        ],
      })

      const writable = await handle.createWritable()
      await writable.write(csvHeaders(referenceDataHeaders))

      await csvOut(writable, referenceRows(references))
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
