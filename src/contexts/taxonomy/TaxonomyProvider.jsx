import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import TaxonomyContext from './TaxonomyContext'

import ConfigContext from '@/contexts/config/ConfigContext'

import { getConcept as apiConcept } from '@/lib/model/concept'

import {
  applyConceptMedia,
  areConceptChildrenLoaded as areTaxonomyConceptChildrenLoaded,
  closestConcept as closestTaxonomyConcept,
  filterTaxonomyRanks,
  getAncestorNames as getTaxonomyAncestorNames,
  getConcept as getTaxonomyConcept,
  getConceptPrimaryName as getTaxonomyConceptPrimaryName,
  getNames as getTaxonomyNames,
  insertConcept,
  isConceptLoaded as isTaxonomyConceptLoaded,
  isDescendant as isDescendantConcept,
  isRoot as isTaxonomyRoot,
  loadConceptMediaIncremental,
  loadTaxonomy,
  loadTaxonomyConcept,
  loadTaxonomyConceptDescendants,
  loadTaxonomyConceptGrandchildren,
  removeTaxonomyConcept,
} from '@/lib/model/taxonomy'

import { useContext } from 'react'
import useTaxonomyIntegrity from '@/lib/hooks/useTaxonomyIntegrity'

import { LOADING } from '@/lib/constants/loading.js'
import { createError } from '@/lib/errors'

import { isEqual, withTimeout } from '@/lib/utils'

const MEDIA_FLUSH_COUNT = 60

const TaxonomyProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()

  const { apiFns } = use(ConfigContext)

  const [taxonomy, setTaxonomy] = useState(null)

  const { IS_KB_DEBUG } = useContext(ConfigContext)

  const checkIntegrity = useTaxonomyIntegrity()

  const updateTaxonomy = useCallback(
    updatedTaxonomy => {
      if (IS_KB_DEBUG) {
        try {
          checkIntegrity(updatedTaxonomy)
        } catch (error) {
          showBoundary(error)
          return taxonomy
        }
      }
      setTaxonomy(updatedTaxonomy)
      return updatedTaxonomy
    },
    [IS_KB_DEBUG, checkIntegrity, showBoundary, taxonomy]
  )

  const conceptEditsRefresh = useCallback(
    async (freshConcept, staleConcept) => {
      if (freshConcept === staleConcept) {
        return { concept: freshConcept, taxonomy }
      }

      const aliasMap = { ...taxonomy.aliasMap }
      const conceptMap = { ...taxonomy.conceptMap }
      let names = taxonomy.names

      const aliasesChanged = !isEqual(freshConcept.alternateNames, staleConcept.alternateNames)
      const childrenChanged = !isEqual(freshConcept.children, staleConcept.children)
      const nameChanged = freshConcept.name !== staleConcept.name
      const parentChanged = freshConcept.parent !== staleConcept.parent

      delete conceptMap[staleConcept.name]
      staleConcept.alternateNames.forEach(alternateName => {
        delete aliasMap[alternateName]
      })
      insertConcept(freshConcept, conceptMap, aliasMap)

      if (childrenChanged) {
        const addedChildren = freshConcept.children.filter(name => !staleConcept.children.includes(name))
        const removedChildren = staleConcept.children.filter(name => !freshConcept.children.includes(name))

        await Promise.all(
          addedChildren
            .filter(childName => childName !== staleConcept.name)
            .map(async childName => {
              const existingChild = conceptMap[childName]
              if (existingChild && existingChild.parent === freshConcept.name) {
                return
              }

              const child = await apiConcept(apiFns, childName)
              child.parent = freshConcept.name
              insertConcept(child, conceptMap, aliasMap)
            })
        )

        removedChildren.forEach(childName => {
          const removed = conceptMap[childName]
          if (removed) {
            if (Array.isArray(removed.alternateNames)) {
              removed.alternateNames.forEach(aliasName => {
                delete aliasMap[aliasName]
              })
            }
            delete conceptMap[childName]
          }
        })
      }

      const copyParent = parentName => {
        const parentConcept = conceptMap[parentName]
        if (!parentConcept) {
          throw new Error(`Cannot refresh concept with missing parent in taxonomy: ${parentName}`)
        }

        return {
          ...parentConcept,
          children: [...(parentConcept.children ?? [])],
        }
      }

      if (parentChanged) {
        const freshParent = copyParent(freshConcept.parent)
        if (!freshParent.children.includes(freshConcept.name)) {
          freshParent.children.push(freshConcept.name)
          freshParent.children.sort()
        }
        insertConcept(freshParent, conceptMap, aliasMap)
        const staleParent = copyParent(staleConcept.parent)
        staleParent.children = staleParent.children.filter(
          child => child !== staleConcept.name && child !== freshConcept.name
        )
        insertConcept(staleParent, conceptMap, aliasMap)
      } else if (nameChanged) {
        const parent = copyParent(freshConcept.parent)
        parent.children = parent.children.filter(child => child !== staleConcept.name)
        if (!parent.children.includes(freshConcept.name)) {
          parent.children.push(freshConcept.name)
          parent.children.sort()
        }
        insertConcept(parent, conceptMap, aliasMap)
      }

      if (aliasesChanged || childrenChanged || nameChanged) {
        names = [...Object.keys(conceptMap), ...Object.keys(aliasMap)].sort()
      }

      const updatedTaxonomy = { ...taxonomy, aliasMap, conceptMap, names }

      const committedTaxonomy = updateTaxonomy(updatedTaxonomy)
      if (committedTaxonomy !== updatedTaxonomy) {
        return { concept: staleConcept, taxonomy: committedTaxonomy || taxonomy }
      }

      return { concept: freshConcept, taxonomy: updatedTaxonomy }
    },
    [apiFns, taxonomy, updateTaxonomy]
  )

  const closestConcept = useCallback(
    conceptName => {
      const concept = getTaxonomyConcept(taxonomy, conceptName)
      return closestTaxonomyConcept(taxonomy, concept)
    },
    [taxonomy]
  )

  const filterRanks = useCallback(
    (field, otherValue) => {
      if (!taxonomy) return []
      return filterTaxonomyRanks(taxonomy, field, otherValue)
    },
    [taxonomy]
  )

  const getConcept = useCallback(
    conceptName => {
      if (!taxonomy) return null
      return getTaxonomyConcept(taxonomy, conceptName)
    },
    [taxonomy]
  )

  const getConceptFromTaxonomy = useCallback((conceptTaxonomy, conceptName) => {
    if (!conceptTaxonomy) return null
    return getTaxonomyConcept(conceptTaxonomy, conceptName)
  }, [])

  const getConceptPrimaryName = useCallback(
    conceptName => {
      if (!taxonomy) return null
      return getTaxonomyConceptPrimaryName(taxonomy, conceptName)
    },
    [taxonomy]
  )

  const getAncestorNames = useCallback(
    conceptName => {
      if (!taxonomy) return []
      return getTaxonomyAncestorNames(taxonomy, conceptName)
    },
    [taxonomy]
  )

  const getNames = useCallback(() => {
    if (!taxonomy) return []
    return getTaxonomyNames(taxonomy)
  }, [taxonomy])

  const checkConceptName = useCallback(conceptName => getTaxonomyNames(taxonomy).includes(conceptName), [taxonomy])

  const isConceptLoaded = useCallback(
    conceptName => {
      if (!taxonomy) return false
      return isTaxonomyConceptLoaded(taxonomy, conceptName)
    },
    [taxonomy]
  )

  const isDescendant = useCallback(
    (conceptName, descendantName) => {
      if (!taxonomy) return false
      return isDescendantConcept(taxonomy, conceptName, descendantName)
    },
    [taxonomy]
  )

  const isRoot = useCallback(
    concept => {
      if (!taxonomy) return false
      return isTaxonomyRoot(taxonomy, concept)
    },
    [taxonomy]
  )

  const rootName = useMemo(() => taxonomy?.rootName, [taxonomy?.rootName])

  const alreadyLoadingConcept = useRef(false)

  const loadConcept = useCallback(
    async (conceptName, force = false) => {
      if (!taxonomy || !apiFns) return null

      if (!force && isConceptLoaded(conceptName)) {
        const loadedConcept = getTaxonomyConcept(taxonomy, conceptName)
        if (!loadedConcept) {
          throw new Error(`Taxonomy reported concept as loaded but lookup failed: ${conceptName}`)
        }
        return loadedConcept
      }

      if (alreadyLoadingConcept.current) {
        return null
      }

      try {
        alreadyLoadingConcept.current = true

        const { taxonomy: updatedTaxonomy } = await loadTaxonomyConcept(taxonomy, conceptName, apiFns)
        const committedTaxonomy = updateTaxonomy(updatedTaxonomy)
        const effectiveTaxonomy = committedTaxonomy || taxonomy
        const loadedConcept = getTaxonomyConcept(effectiveTaxonomy, conceptName)
        if (!loadedConcept) {
          throw new Error(`Taxonomy load completed but concept lookup failed: ${conceptName}`)
        }

        return loadedConcept
      } catch (error) {
        showBoundary(error)
        throw error
      } finally {
        alreadyLoadingConcept.current = false
      }
    },
    [apiFns, isConceptLoaded, showBoundary, taxonomy, updateTaxonomy]
  )

  const mediaInFlightRef = useRef(new Set())

  // Background fill of tree-icon media after a descendants load. Commits accumulate and
  //  flush in chunks via functional updates, so media merges onto whatever taxonomy is
  //  current (concept switches / edits mid-fill are not clobbered) and the tree re-renders
  //  a few times per fill instead of once per batch. Never reaches the error boundary.
  const fillConceptMedia = useCallback(
    mediaNames => {
      const pending = mediaNames.filter(name => !mediaInFlightRef.current.has(name))
      if (pending.length === 0) return
      pending.forEach(name => mediaInFlightRef.current.add(name))

      let accumulated = []
      const flush = () => {
        if (accumulated.length === 0) return
        const entries = accumulated
        accumulated = []
        setTaxonomy(current => {
          if (!current) return current
          const conceptMap = { ...current.conceptMap }
          const aliasMap = { ...current.aliasMap }
          entries.forEach(([name, media]) => applyConceptMedia(conceptMap, aliasMap, name, media))
          return { ...current, conceptMap, aliasMap }
        })
      }

      loadConceptMediaIncremental(pending, apiFns, succeeded => {
        accumulated.push(...succeeded)
        if (accumulated.length >= MEDIA_FLUSH_COUNT) flush()
      }).finally(() => {
        pending.forEach(name => mediaInFlightRef.current.delete(name))
        flush()
      })
    },
    [apiFns]
  )

  const loadConceptDescendants = useCallback(
    async concept => {
      if (!apiFns || !taxonomy) return null
      try {
        const { mediaNames, taxonomy: updatedTaxonomy } = await loadTaxonomyConceptDescendants(taxonomy, concept, apiFns)
        const committedTaxonomy = updateTaxonomy(updatedTaxonomy)
        fillConceptMedia(mediaNames)

        return committedTaxonomy || taxonomy
      } catch (error) {
        showBoundary(error)
      }
    },
    [apiFns, fillConceptMedia, showBoundary, taxonomy, updateTaxonomy]
  )

  const loadConceptChildren = useCallback(
    async conceptName => {
      if (!apiFns || !taxonomy) return null
      if (areTaxonomyConceptChildrenLoaded(taxonomy, conceptName)) return taxonomy
      try {
        const { taxonomy: updatedTaxonomy } = await loadTaxonomyConceptGrandchildren(taxonomy, conceptName, apiFns)
        const committedTaxonomy = updateTaxonomy(updatedTaxonomy)

        return committedTaxonomy || taxonomy
      } catch (error) {
        showBoundary(error)
      }
    },
    [apiFns, showBoundary, taxonomy, updateTaxonomy]
  )

  const removeConcept = useCallback(
    conceptName => {
      const concept = getTaxonomyConcept(taxonomy, conceptName)
      if (!concept) {
        throw new Error(`Cannot remove missing concept from taxonomy: ${conceptName}`)
      }
      const { taxonomy: updatedTaxonomy } = removeTaxonomyConcept(taxonomy, concept)
      const committedTaxonomy = updateTaxonomy(updatedTaxonomy)
      return committedTaxonomy || taxonomy
    },
    [taxonomy, updateTaxonomy]
  )

  useEffect(() => {
    if (!apiFns || taxonomy) return
    let cancelled = false
    const loadInitialTaxonomy = async () => {
      try {
        const { taxonomy: rootTaxonomy } = await loadTaxonomy(apiFns)
        return loadTaxonomyConcept(rootTaxonomy, rootTaxonomy.rootName, apiFns)
      } catch (error) {
        return { error }
      }
    }

    withTimeout(
      loadInitialTaxonomy(),
      LOADING.STARTUP.TAXONOMY_TIMEOUT,
      createError(
        'Taxonomy Load Timeout',
        `Taxonomy did not finish loading within ${LOADING.STARTUP.TAXONOMY_TIMEOUT}ms`,
        { timeoutMs: LOADING.STARTUP.TAXONOMY_TIMEOUT }
      )
    ).then(
      ({ error: taxonomyError, taxonomy: initialTaxonomy }) => {
        if (cancelled) return
        if (taxonomyError) {
          showBoundary(taxonomyError)
        } else {
          updateTaxonomy(initialTaxonomy)
        }
      },
      error => {
        if (cancelled) return
        showBoundary(error)
      }
    )

    return () => {
      cancelled = true
    }
  }, [apiFns, taxonomy, showBoundary, updateTaxonomy])

  const value = useMemo(
    () => ({
      checkConceptName,
      conceptEditsRefresh,
      closestConcept,
      filterRanks,
      getConcept,
      getConceptFromTaxonomy,
      getConceptPrimaryName,
      getAncestorNames,
      getNames,
      isConceptLoaded,
      isDescendant,
      isRoot,
      loadConcept,
      loadConceptChildren,
      loadConceptDescendants,
      removeConcept,
      rootName,
      taxonomy,
      updateTaxonomy,
    }),
    [
      checkConceptName,
      conceptEditsRefresh,
      closestConcept,
      filterRanks,
      getAncestorNames,
      getConcept,
      getConceptFromTaxonomy,
      getConceptPrimaryName,
      getNames,
      rootName,
      isConceptLoaded,
      isDescendant,
      isRoot,
      loadConcept,
      loadConceptChildren,
      loadConceptDescendants,
      removeConcept,
      taxonomy,
      updateTaxonomy,
    ]
  )

  // Don't render children until taxonomy is loaded
  if (!taxonomy) {
    return <TaxonomyContext value={value}>{null}</TaxonomyContext>
  }

  return <TaxonomyContext value={value}>{children}</TaxonomyContext>
}

export default TaxonomyProvider
