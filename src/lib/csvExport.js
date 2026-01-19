import { COMMON } from '@/text'

import { csvEscape, csvHeaders, csvOut } from '@/lib/csv'
import { createError } from '@/lib/errors'
import { humanTimestamp } from '@/lib/utils'

const csvExport = ({
  comments = [],
  count,
  estimatedTotalPages,
  getData,
  headers,
  onProgress,
  paginated = false,
  suggestName,
  title,
  user,
}) => {
  const csvRowsToString = dataRows =>
    dataRows.map(row => row.map(csvEscape).join(',')).join('\n') + '\n'

  const csvComments = count => {
    let commentText = `# ${title}\n`
    if (comments) {
      commentText += comments.map(line => `#   ${line}`).join('\n')
      commentText += '\n'
    }
    if (count) {
      commentText += `#   Total: ${count}\n`
    }
    commentText += `#   Exported By: ${user.name}\n`
    commentText += `#   Date: ${humanTimestamp(new Date())}\n`
    commentText += '#\n'
    return commentText
  }

  const exportToCsv = async () => {
    if (!window?.showSaveFilePicker) {
      try {
        let content = csvComments(count) + csvHeaders(headers)

        if (paginated) {
          let pageIndex = 0
          let hasMoreData = true

          while (hasMoreData) {
            if (onProgress && estimatedTotalPages) {
              onProgress(COMMON.EXPORT.CSV.PROGRESS.replace('{page}', pageIndex + 1).replace('{total}', estimatedTotalPages))
            }

            const data = await getData(pageIndex)

            if (!data || data.length === 0) {
              hasMoreData = false
            } else {
              content += csvRowsToString(data)
              pageIndex++
            }
          }
        } else {
          const data = await getData()
          if (data && data.length > 0) {
            content += csvRowsToString(data)
          }
        }

        const fileName = suggestName()
        const blob = new Blob([content], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        link.click()
        URL.revokeObjectURL(url)
        if (onProgress) {
          onProgress({ status: 'done', fileName })
        }
      } catch (error) {
        throw createError(
          COMMON.EXPORT.CSV.ERROR.TITLE,
          `${COMMON.EXPORT.CSV.ERROR.GENERATE_FAILED}: ${error.message}`,
          { error: error.message },
          error
        )
      } finally {
        if (onProgress) {
          onProgress(false)
        }
      }
      return
    }

    let writable = null
    let handle = null

    try {
      handle = await window.showSaveFilePicker({
        suggestedName: suggestName(),
        types: [
          {
            description: COMMON.EXPORT.CSV.FILE_TYPE,
            accept: { [COMMON.EXPORT.CSV.MIME_TYPE]: [COMMON.EXPORT.CSV.FILE_EXTENSION] },
          },
        ],
      })
    } catch (error) {
      if (error.name !== 'AbortError') {
        throw createError(
          COMMON.EXPORT.CSV.ERROR.TITLE,
          `${COMMON.EXPORT.CSV.ERROR.FILE_PICKER_FAILED}: ${error.message}`,
          { error: error.message },
          error
        )
      }
      if (onProgress) {
        onProgress(false)
      }
      return
    }

    try {
      writable = await handle.createWritable()
      if (paginated) {
        await writable.write(csvComments(count))
        await writable.write(csvHeaders(headers))

        let pageIndex = 0
        let hasMoreData = true

        while (hasMoreData) {
          if (onProgress && estimatedTotalPages) {
            onProgress(COMMON.EXPORT.CSV.PROGRESS.replace('{page}', pageIndex + 1).replace('{total}', estimatedTotalPages))
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
        const count = data?.length
        await writable.write(csvComments(count))
        await writable.write(csvHeaders(headers))

        if (data && count > 0) {
          await csvOut(writable, data)
        }
      }

      await writable.close()
      if (onProgress) {
        onProgress({ status: 'done', fileName: handle?.name || suggestName() })
      }
    } catch (error) {
      throw createError(
        COMMON.EXPORT.CSV.ERROR.TITLE,
        `${COMMON.EXPORT.CSV.ERROR.WRITE_FAILED}: ${error.message}`,
        { error: error.message },
        error
      )
    } finally {
      if (onProgress) {
        onProgress(false)
      }
    }
  }

  return exportToCsv
}

export default csvExport
