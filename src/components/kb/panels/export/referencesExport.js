import { getReferences } from '@/lib/api/references'

const referenceDataHeaders = ['DOI', 'Citation', 'Concepts']

const referencesExport = async ({ apiFns }) => {
  try {
    const references = await apiFns.apiPaginated(getReferences)

    const csvRows = references.map(reference => [
      reference.doi,
      reference.citation,
      reference.concepts.join(' | '),
    ])

    const csvContent = [referenceDataHeaders.join(','), ...csvRows.map(row => row.join(','))].join(
      '\n'
    )

    const file = new File([csvContent], 'KB-References.csv', { type: 'text/csv' })

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

      const writable = await handle.createWritable()
      await writable.write(file)
      await writable.close()
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error saving file:', err)
      }
    }
  } catch (error) {
    console.error('Error exporting references:', error)
  }
}

export default referencesExport
