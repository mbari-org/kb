import { use, useCallback } from 'react'

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

const conceptData = async (concept, apiFns) => {
  const aliases = concept.aliases
    ? concept.aliases
    : orderedAliases(await apiFns.apiPayload(getConceptNames, concept.name))

  return {
    name: concept.name,
    aliases: aliases.map(alias => drop(alias, ['id'])),
    author: 'unknown',
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

const descendantData = async (concept, getConcept, apiFns) => {
  const nestedDescendants = []
  const queue = concept.children.map(name => ({ name, parentChildren: nestedDescendants }))

  while (queue.length > 0) {
    const { name, parentChildren } = queue.shift()
    const nextConcept = getConcept(name)
    const nextData = await conceptData(nextConcept, apiFns)
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

const useTaxonomyData = () => {
  const { beginProcessing } = use(AppModalContext)
  const { apiFns } = use(ConfigContext)
  const { concept } = use(ConceptContext)
  const { getConcept, loadConceptDescendants } = use(TaxonomyContext)

  return useCallback(
    async conceptExtent => {
      if (conceptExtent === CONCEPT.EXTENT.DESCENDANTS) {
        const processing = beginProcessing(PROCESSING.LOAD, null, { delayMs: 0 })
        if (processing.updateMessage) {
          processing.updateMessage('Loading concept descendants ...')
        }
        try {
          await loadConceptDescendants(concept)
        } finally {
          processing()
        }
      }

      const exportData = await conceptData(concept, apiFns)

      switch (conceptExtent) {
        case CONCEPT.EXTENT.SOLO:
          exportData.children = concept.children
          break
        case CONCEPT.EXTENT.CHILDREN: {
          const childConcepts = concept.children.map(child => getConcept(child))
          exportData.children = await Promise.all(
            childConcepts.map(child => conceptData(child, apiFns))
          )
          break
        }
        case CONCEPT.EXTENT.DESCENDANTS:
          exportData.children = await descendantData(concept, getConcept, apiFns)
          break
      }
      return exportData

    },
    [apiFns, beginProcessing, concept, getConcept, loadConceptDescendants]
  )
}

export default useTaxonomyData
