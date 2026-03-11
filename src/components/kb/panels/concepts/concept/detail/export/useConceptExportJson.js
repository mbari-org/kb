import { use, useCallback } from 'react'

import { createError } from '@/lib/errors'
import useTaxonomyData from '@/lib/hooks/useTaxonomyData'
import { getSuggestedFileName } from './conceptExport'
import useConceptExportProgress from './useConceptExportProgress'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const getJsonData = async ({
  conceptExtent,
  fileName,
  getTaxonomyData,
  onProgress,

}) => {
  onProgress?.('Formatting concept data ...')
  const taxonomyData = await getTaxonomyData(conceptExtent)

  onProgress?.(`Generating JSON for ${fileName} ...`)
  return JSON.stringify(taxonomyData, null, 2) + '\n'
}

const dataOutput = async fileName => {
  if (window.showSaveFilePicker) {
    const handle = await window.showSaveFilePicker({
      suggestedName: fileName,
      types: [
        {
          description: 'JSON Files',
          accept: { 'application/json': ['.json'] },
        },
      ],
    })
    return { outputFn: viaFilePicker, handle }
  }

  return { outputFn: viaLinkDownload }
}

// File picker gives more user control, but is not supported in all browsers
// showSaveFilePicker MUST be called before any await, or Chrome blocks it (transient activation)
const viaFilePicker = async ({ handle, jsonData }) => {
  const writable = await handle.createWritable()
  await writable.write(jsonData)
  await writable.close()
}

// Only if file picker is not supported
const viaLinkDownload = async ({ fileName, jsonData }) => {
  const blob = new Blob([jsonData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

const useConceptExportJson = conceptExtent => {
  const { concept } = use(ConceptContext)

  const onProgress = useConceptExportProgress()
  const getTaxonomyData = useTaxonomyData()

  return useCallback(async () => {
    const fileName = getSuggestedFileName({ concept, conceptExtent, extension: 'json' })
    const contentParams = {
      concept,
      conceptExtent,
      fileName,
      getTaxonomyData,
      onProgress,
    }

    try {
      const { handle, outputFn } = await dataOutput(fileName)
      const outputFile = handle?.name || fileName

      onProgress?.('Get Concept data ...')
      const jsonData = await getJsonData(contentParams)

      onProgress?.(`Output Concept data to ${outputFile} ...`)
      handle ? await outputFn({ handle, jsonData }) : await outputFn({ fileName: outputFile, jsonData })
      onProgress?.({ status: 'done', fileName: outputFile })
    } catch (error) {
      // User cancel
      if (error?.name === 'AbortError') {
        return
      }

      const errorMessage = error?.message || `${error}`
      throw createError(
        'JSON Export Error',
        `Failed to export JSON file: ${errorMessage}`,
        { error: errorMessage },
        error
      )
    } finally {
      onProgress?.(false)
    }
  }, [concept, conceptExtent, getTaxonomyData, onProgress])
}

export default useConceptExportJson
