import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import { getDescendantsInfo } from '@/lib/kb/model/concept'

import csvExport from '@/lib/csvExport'

import { capitalize, conceptNameForFilename } from '@/lib/utils'

import { CONCEPT_EXTENT } from '@/lib/constants/constants'

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

const suggestName = ({ concept, conceptExtent }) => {
  const extent = conceptExtent !== CONCEPT_EXTENT.CONCEPT ? `_and_${conceptExtent}` : ''
  return `KB-Concepts_${conceptNameForFilename(concept.name)}${extent}.csv`
}

const useConceptExportCsv = conceptExtent => {
  const { concept } = use(ConceptContext)
  const { apiFns } = use(ConfigContext)
  const { setExporting } = use(PanelDataContext)
  const { getConcept } = use(TaxonomyContext)
  const { user } = use(UserContext)

  const getData = useCallback(async () => {
    const parent = getConcept(concept.parent)

    switch (conceptExtent) {
      case CONCEPT_EXTENT.CONCEPT: {
        return [dataRow(concept, parent.id)]
      }

      case CONCEPT_EXTENT.CHILDREN: {
        return concept.children.reduce((acc, child) => {
          const childConcept = getConcept(child)
          acc.push(dataRow(childConcept, concept.id))
          return acc
        }, [dataRow(concept, parent.id)])
      }

      case CONCEPT_EXTENT.DESCENDANTS: {
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
    onProgress: setExporting,
    paginated: false,
    suggestName: () => suggestName({ concept, conceptExtent }),
    title: `Knowledge Base Concept: ${concept.name}`,
    user,
  })
}

export default useConceptExportCsv
