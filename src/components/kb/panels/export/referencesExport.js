import { getReferences } from '@/lib/api/references'

const referenceDataHeaders = ['DOI', 'Citation', 'Concepts']

const referencesExport = async ({ apiFns }) => {
  try {
    const references = await apiFns.apiPagination(getReferences)

    const csvRows = references.map(reference => [
      reference.doi,
      reference.citation,
      reference.concepts.join(' | '),
    ])

    const csvContent = [referenceDataHeaders.join(','), ...csvRows.map(row => row.join(','))].join(
      '\n'
    )

    // Create a File object
    const file = new File([csvContent], 'KB-References.csv', { type: 'text/csv' })

    try {
      // Request a file handle
      const handle = await window.showSaveFilePicker({
        suggestedName: 'KB-References.csv',
        types: [
          {
            description: 'CSV Files',
            accept: { 'text/csv': ['.csv'] },
          },
        ],
      })

      // Create a FileSystemWritableFileStream to write to
      const writable = await handle.createWritable()
      // Write the contents
      await writable.write(file)
      // Close the file and write the contents to disk
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
