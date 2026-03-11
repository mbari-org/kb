import { use, useCallback, useMemo } from 'react'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { getConceptNames } from '@/lib/api/concept'
import { CONCEPT } from '@/lib/constants/concept'
import { orderedAliases } from '@/lib/model/aliases'
import { drop } from '@/lib/utils'
import CONFIG from '@/text'

const { PROCESSING } = CONFIG
export const ALWAYS_INCLUDED_FIELDS = ['name', 'children']
export const OPTIONAL_FIELDS = ['aliases', 'author', 'media', 'parent', 'rank', 'realizations']

const conceptDataFn = apiFns => {
  return async (concept, includeFields) => {
    const exportData = {
      name: concept.name,
      children: concept.children,
    }

    if (includeFields.aliases) {
      const aliases = concept.aliases
        ? concept.aliases
        : orderedAliases(await apiFns.apiPayload(getConceptNames, concept.name))
      exportData.aliases = aliases.map(alias => drop(alias, ['id']))
    }
    if (includeFields.author) {
      exportData.author = concept.author
    }
    if (includeFields.media) {
      exportData.media = concept.media
        ? concept.media.map(item => drop(item, ['conceptName', 'id', 'lastUpdated']))
        : []
    }
    if (includeFields.parent) {
      exportData.parent = concept.parent
    }
    if (includeFields.rank) {
      exportData.rankLevel = concept.rankLevel || ''
      exportData.rankName = concept.rankName || ''
    }
    if (includeFields.realizations) {
      exportData.realizations = concept.realizations
        ? concept.realizations.map(realization => drop(realization, ['id']))
        : []
    }

    return exportData
  }
}

const descendantDataFn = getConceptData => {
  return async (concept, getConcept, includeFields) => {
    const nestedDescendants = []
    const queue = concept.children.map(name => ({ name, parentChildren: nestedDescendants }))

    while (queue.length > 0) {
      const { name, parentChildren } = queue.shift()
      const nextConcept = getConcept(name)
      if (!nextConcept) {
        throw new Error(`Failed to load concept data for descendant: ${name}`)
      }
      const nextData = await getConceptData(nextConcept, includeFields)
      nextData.children = []
      parentChildren.push(nextData)
      if (nextConcept.children?.length) {
        nextConcept.children.forEach(childName =>
          queue.push({ name: childName, parentChildren: nextData.children })
        )
      }
    }

    return nestedDescendants
  }
}

const useConceptData = () => {
  const { beginProcessing } = use(AppModalContext)
  const { apiFns } = use(ConfigContext)
  const { concept: exportedConcept } = use(ConceptContext)
  const { getConcept, getConceptFromTaxonomy, loadConceptDescendants } = use(TaxonomyContext)
  const conceptData = useMemo(() => conceptDataFn(apiFns), [apiFns])
  const descendantData = useMemo(() => descendantDataFn(conceptData), [conceptData])

  return useCallback(
    async (conceptExtent, includeFieldsInput) => {
      const includeFields = includeFieldsInput
      let getTaxonomyConcept = getConcept

      if (conceptExtent === CONCEPT.EXTENT.DESCENDANTS) {
        const processing = beginProcessing(PROCESSING.LOAD, null, { delayMs: 0 })
        if (processing.updateMessage) {
          processing.updateMessage('Loading concept descendants ...')
        }
        try {
          const updatedTaxonomy = await loadConceptDescendants(exportedConcept)
          // Create a new getTaxonomyConcept function that references the updated taxonomy with descendants since the
          // getConcept from TaxonomyContext will be stale here, and due to React rendering behavior, won't have the
          // updated taxonomy until this function completes and components re-render.
          if (updatedTaxonomy) {
            getTaxonomyConcept = conceptName =>
              getConceptFromTaxonomy(updatedTaxonomy, conceptName)
          }
        } finally {
          processing()
        }
      }

      const exportData = await conceptData(exportedConcept, includeFields)

      if (conceptExtent === CONCEPT.EXTENT.SOLO) {
        exportData.children = exportedConcept.children
      } else if (conceptExtent === CONCEPT.EXTENT.CHILDREN) {
        exportData.children = await Promise.all(
          exportedConcept.children.map(async childName => {
            const childConcept = getTaxonomyConcept(childName)
            if (!childConcept) {
              throw new Error(`Failed to load concept data for child: ${childName}`)
            }
            return conceptData(childConcept, includeFields)
          })
        )
      } else if (conceptExtent === CONCEPT.EXTENT.DESCENDANTS) {
        exportData.children = await descendantData(exportedConcept, getTaxonomyConcept, includeFields)
      }

      return exportData
    },
    [
      beginProcessing,
      exportedConcept,
      conceptData,
      descendantData,
      getConcept,
      getConceptFromTaxonomy,
      loadConceptDescendants,
    ]
  )
}

export default useConceptData