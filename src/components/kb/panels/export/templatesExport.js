import { getTemplates, getTemplatesCount } from '@/lib/api/linkTemplates'
import { PAGINATION } from '@/lib/constants'

const templateDataHeaders = ['Concept', 'Link Name', 'To Concept', 'Link Value', 'Last Updated']

// Helper function to escape CSV fields
const escapeCSV = field => {
  if (field == null) return ''
  const stringField = String(field)
  // If field contains comma, quote, or newline, wrap in quotes and escape existing quotes
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`
  }
  return stringField
}

const templatesExport = async ({ apiFns }) => {
  try {
    const totalCount = await apiFns.apiResult(getTemplatesCount)
    if (!totalCount) return

    const templatesPerPage =
      PAGINATION.TEMPLATES.PAGE_SIZE_OPTIONS[PAGINATION.TEMPLATES.PAGE_SIZE_OPTIONS.length - 1]
    const totalPages = Math.ceil(totalCount / templatesPerPage)

    const handle = await window.showSaveFilePicker({
      suggestedName: 'KB-Templates.csv',
      types: [
        {
          description: 'CSV Files',
          accept: { 'text/csv': ['.csv'] },
        },
      ],
    })

    const writable = await handle.createWritable()

    await writable.write(templateDataHeaders.map(escapeCSV).join(',') + '\n')

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      const templates = await apiFns.apiPaginated(getTemplates, {
        limit: templatesPerPage,
        offset: pageIndex * templatesPerPage,
      })

      const csvRows = templates.map(template =>
        [
          template.concept,
          template.linkName,
          template.toConcept,
          template.linkValue,
          template.lastUpdated,
        ].map(escapeCSV)
      )

      const csvContent = csvRows.map(row => row.join(',')).join('\n')
      await writable.write(csvContent + (pageIndex < totalPages - 1 ? '\n' : ''))
    }

    await writable.close()
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Error saving file:', err)
    }
  }
}

export default templatesExport
