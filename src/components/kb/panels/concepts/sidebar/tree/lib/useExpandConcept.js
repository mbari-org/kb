import { use, useCallback } from 'react'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import CONFIG from '@/lib/config'
import { CONCEPT } from '@/lib/constants'

const { PROCESSING } = CONFIG

const allExpandable = (taxonomy, conceptName, names = []) => {
  const concept = taxonomy.conceptMap[conceptName]
  if (!concept?.children?.length) return names
  names.push(concept.name)
  concept.children.forEach(child => allExpandable(taxonomy, child, names))
  return names
}

const allDescendants = (taxonomy, conceptName, names = [conceptName]) => {
  taxonomy.conceptMap[conceptName]?.children?.forEach(child => {
    names.push(child)
    allDescendants(taxonomy, child, names)
  })
  return names
}

const useExpandConcept = (expandedItems, setExpandedItems) => {
  const { beginProcessing } = use(AppModalContext)
  const { conceptPath } = use(ConceptContext)
  const { loadConceptChildren, loadConceptDescendants, taxonomy } = use(TaxonomyContext)

  const isExpanded = useCallback(
    concept => {
      return expandedItems.includes(concept.name)
    },
    [expandedItems]
  )

  const collapse = useCallback(
    concept => {
      const pruning = new Set(allDescendants(taxonomy, concept.name))
      setExpandedItems(prevItems => prevItems.filter(id => !pruning.has(id)))
    },
    [setExpandedItems, taxonomy]
  )

  const expand = useCallback(() => {
    if (conceptPath) {
      setExpandedItems(prevItems => [...new Set([...prevItems, ...conceptPath])])
    }
  }, [setExpandedItems, conceptPath])

  const expandToParent = useCallback(() => {
    if (conceptPath) {
      setExpandedItems(prevItems => [...new Set([...prevItems, ...conceptPath.slice(0, -1)])])
    }
  }, [setExpandedItems, conceptPath])

  const expandSelf = useCallback(
    concept => {
      setExpandedItems(prevItems => [...new Set([...prevItems, concept.name])])
      loadConceptChildren(concept.name)
    },
    [loadConceptChildren, setExpandedItems]
  )

  const descendants = useCallback(
    concept => {
      const stop = beginProcessing(PROCESSING.LOAD, PROCESSING.ARG.CONCEPT_DESCENDANTS, {
        delayMs: 0,
        timeoutMs: 120000,
      })
      loadConceptDescendants(concept)
        .then(updatedTaxonomy => {
          if (!updatedTaxonomy) return
          const expandable = allExpandable(updatedTaxonomy, concept.name)
          setExpandedItems(prevItems => [...new Set([...prevItems, ...expandable])])
        })
        .finally(stop)
    },
    [beginProcessing, loadConceptDescendants, setExpandedItems]
  )

  const toggle = useCallback(
    concept => {
      isExpanded(concept) ? collapse(concept) : expand(concept)
    },
    [collapse, expand, isExpanded]
  )

  return useCallback(
    (concept, expanded) => {
      switch (expanded) {
        case CONCEPT.EXPAND.DESCENDANTS:
          descendants(concept)
          break

        case CONCEPT.EXPAND.OFF:
          collapse(concept)
          break

        case CONCEPT.EXPAND.ON:
          expand(concept)
          break

        case CONCEPT.EXPAND.SELF:
          expandSelf(concept)
          break

        case CONCEPT.EXPAND.TO_PARENT:
          expandToParent()
          break

        case CONCEPT.EXPAND.TOGGLE:
          toggle(concept)
          break
      }
    },
    [collapse, descendants, expand, expandSelf, expandToParent, toggle]
  )
}

export default useExpandConcept
