import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import { getDescendantsInfo } from '@/lib/model/concept'
import { getSuggestedFileName } from './conceptExport'
import useConceptExportProgress from './useConceptExportProgress'

import { CONCEPT } from '@/lib/constants'
import csvExport from '@/lib/csvExport'
import { capitalize } from '@/lib/utils'

const dataHeaders = [
  'id',
  'parentId',
  'names',
]

const conceptNames = (name, alternateNames) => {
  return alternateNames.length > 0
    ? `${name}; ${alternateNames.join(', ')}`
    : name
}

const dataRow = (concept, parentId) => {
  const names = conceptNames(concept.name, concept.alternateNames)
  return [concept.id, parentId, names]
}

const commentsContent = ({ concept, conceptExtent }) => {
  return [`Concept: ${concept.name}`, `Extent: ${capitalize(conceptExtent)}`]
}

const useConceptExportCsv = conceptExtent => {
  const { concept } = use(ConceptContext)
  const { apiFns } = use(ConfigContext)
  const { getConcept } = use(TaxonomyContext)
  const { user } = use(UserContext)

  const onProgress = useConceptExportProgress()

  const getData = useCallback(async () => {
    const parent = getConcept(concept.parent)

    switch (conceptExtent) {
      case CONCEPT.EXTENT.SOLO: {
        return [dataRow(concept, parent.id)]
      }

      case CONCEPT.EXTENT.CHILDREN: {
        return concept.children.reduce((acc, child) => {
          const childConcept = getConcept(child)
          acc.push(dataRow(childConcept, concept.id))
          return acc
        }, [dataRow(concept, parent.id)])
      }

      case CONCEPT.EXTENT.DESCENDANTS: {
        const descendantsInfo = await getDescendantsInfo(apiFns, concept.name, concept.id)
        return descendantsInfo.reduce((acc, descendant) => {
          acc.push([descendant.id, descendant.parentId, conceptNames(descendant.name, descendant.alternateNames)])
          return acc
        }, [dataRow(concept, parent.id)])
      }
    }
  }, [apiFns, concept, conceptExtent, getConcept])

  return csvExport({
    comments: commentsContent({ concept, conceptExtent }),
    count: 0,
    getData,
    headers: dataHeaders,
    onProgress,
    paginated: false,
    suggestName: () => getSuggestedFileName({ concept, conceptExtent, extension: 'csv' }),
    title: `Knowledge Base Concept: ${concept.name}`,
    user,
  })
}

export default useConceptExportCsv
