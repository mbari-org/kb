import { use, useCallback } from 'react'

import { createError } from '@/lib/errors'
import useTaxonomyData from '@/lib/hooks/useTaxonomyData'
import { getSuggestedFileName } from './conceptExport'
import useConceptExportProgress from './useConceptExportProgress'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const getContent = async ({
  concept,
  conceptExtent,
  getTaxonomyData,
  onProgress,
  fileName,
}) => {
  const taxonomyData = await getTaxonomyData(conceptExtent)
  const content = JSON.stringify(taxonomyData, null, 2) + '\n'
  onProgress?.(`Export ${concept.name} to ${fileName} ...`)
  return content
}

const viaFilePicker = async ({ contentParams, fileName, getContent, onProgress }) => {
  if (!window?.showSaveFilePicker) return false

  const handle = await window.showSaveFilePicker({
    suggestedName: fileName,
    types: [
      {
        description: 'JSON Files',
        accept: { 'application/json': ['.json'] },
      },
    ],
  })
  const content = await getContent(contentParams)
  const writable = await handle.createWritable()
  await writable.write(content)
  await writable.close()
  onProgress?.({ status: 'done', fileName: handle?.name || fileName })
  return true
}

const viaLinkDownload = async ({ contentParams, fileName, getContent, onProgress }) => {
  const content = await getContent(contentParams)
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
  onProgress?.({ status: 'done', fileName })
}

const useConceptExportJson = conceptExtent => {
  const { concept } = use(ConceptContext)

  const onProgress = useConceptExportProgress()
  const getTaxonomyData = useTaxonomyData()

  return useCallback(async () => {
    const fileName = getSuggestedFileName({ concept, conceptExtent, extension: 'json' })
    try {
      const contentParams = {
        concept,
        conceptExtent,
        getTaxonomyData,
        onProgress,
        fileName,
      }

      if (await viaFilePicker({ contentParams, fileName, getContent, onProgress })) {
        return
      }

      await viaLinkDownload({ contentParams, fileName, getContent, onProgress })

    } catch (error) {
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
