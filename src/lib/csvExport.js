import { csvHeaders, csvOut } from '@/lib/csv'
import { humanTimestamp } from '@/lib/utils'

const csvExport = ({
  comments = [],
  count,
  estimatedTotalPages,
  getData,
  headers,
  onProgress,
  paginated = false,
  suggestedName,
  title,
  user,
}) => {

  const csvComments = () => {
    let commentText = `# ${title}\n`
    if (comments) {
      commentText += comments.map(line => `#   ${line}`).join('\n')
      commentText += '\n'
    }
    commentText += `#   Total: ${count}\n`
    commentText += `#   Exported By: ${user.name}\n`
    commentText += `#   Date: ${humanTimestamp(new Date())}\n`
    commentText += '#\n'
    return commentText
  }

  const exportToCsv = async () => {
    let writable = null
    let handle = null

    try {
      handle = await window.showSaveFilePicker({
        suggestedName: suggestedName(),
        types: [
          {
            description: 'CSV Files',
            accept: { 'text/csv': ['.csv'] },
          },
        ],
      })
    } catch (error) {
      if (error.name !== 'AbortError') {
        throw new Error(`Error opening file picker: ${error.message}`)
      }
      if (onProgress) {
        onProgress(false)
      }
      return
    }

    try {
      writable = await handle.createWritable()
      await writable.write(csvComments())
      await writable.write(csvHeaders(headers))

      if (paginated) {
        let pageIndex = 0
        let hasMoreData = true

        while (hasMoreData) {
          if (onProgress && estimatedTotalPages) {
            onProgress(`Exporting page ${pageIndex + 1} of ${estimatedTotalPages} to CSV file...`)
          }

          const data = await getData(pageIndex)

          if (!data || data.length === 0) {
            hasMoreData = false
          } else {
            await csvOut(writable, data)
            pageIndex++
          }
        }
      } else {
        const data = await getData()
        if (data && data.length > 0) {
          await csvOut(writable, data)
        }
      }

      await writable.close()
    } catch (error) {
      throw new Error(`Error writing file: ${error.message}`)
    } finally {
      if (onProgress) {
        onProgress(false)
      }
    }
  }

  return exportToCsv
}

export default csvExport
