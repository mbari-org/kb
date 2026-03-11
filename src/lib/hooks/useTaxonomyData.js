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

const conceptData = concept => {
  return {
    name: concept.name,
    aliases: concept.aliases.map(alias => drop(alias, ['id'])),
    author: concept.author,
    children: concept.children,
    media: concept.media
      ? concept.media.map(item => drop(item, ['conceptName', 'id', 'lastUpdated']))
      : [],
    parent: concept.parent,
    rankLevel: concept.rankLevel || '',
    rankName: concept.rankName || '',
    realizations: concept.realizations
      ? concept.realizations.map(realization => drop(realization, ['id']))
      : [],
  }
}

const descendantDataFn = (ensureConceptAliases, getConceptData) => {
  return async (concept, getConcept) => {
    const nestedDescendants = []
    const queue = concept.children.map(name => ({ name, parentChildren: nestedDescendants }))

    while (queue.length > 0) {
      const { name, parentChildren } = queue.shift()
      const nextConcept = getConcept(name)
      if (!nextConcept) {
        throw new Error(`Failed to load concept data for descendant: ${name}`)
      }
      const nextData = getConceptData(await ensureConceptAliases(nextConcept))
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

const ensureConceptAliasesFn = apiFns => {
  return async concept => {
    if (concept.aliases) {
      return concept
    }
    return {
      ...concept,
      aliases: orderedAliases(await apiFns.apiPayload(getConceptNames, concept.name)),
    }
  }
}

const useTaxonomyData = () => {
  const { beginProcessing } = use(AppModalContext)
  const { apiFns } = use(ConfigContext)
  const { concept: exportedConcept } = use(ConceptContext)
  const { getConcept, getConceptFromTaxonomy, loadConceptDescendants } = use(TaxonomyContext)

  const ensureConceptAliases = useMemo(() => ensureConceptAliasesFn(apiFns), [apiFns])
  const descendantData = useMemo(
    () => descendantDataFn(ensureConceptAliases, conceptData),
    [ensureConceptAliases]
  )

  return useCallback(
    async conceptExtent => {
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

      const concept = await ensureConceptAliases(exportedConcept)
      const exportData = conceptData(concept)

      switch (conceptExtent) {
        case CONCEPT.EXTENT.SOLO: {
          exportData.children = exportedConcept.children
          break
        }

        case CONCEPT.EXTENT.CHILDREN: {
          const childConcepts = await Promise.all(
            exportedConcept.children.map(async childName => {
              const childConcept = getTaxonomyConcept(childName)
              if (!childConcept) {
                throw new Error(`Failed to load concept data for child: ${childName}`)
              }
              return ensureConceptAliases(childConcept)
            })
          )
          exportData.children = childConcepts.map(child => conceptData(child))
          break
        }

        case CONCEPT.EXTENT.DESCENDANTS: {
          exportData.children = await descendantData(concept, getTaxonomyConcept)
          break
        }
      }

      return exportData
    },
    [
      beginProcessing,
      exportedConcept,
      ensureConceptAliases,
      descendantData,
      getConcept,
      getConceptFromTaxonomy,
      loadConceptDescendants,
    ]
  )
}

export default useTaxonomyData
