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
  getConceptPath as getTaxonomyConceptPath,
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

  const taxonomyRef = useRef(null)

  const updateTaxonomy = useCallback(
    updatedTaxonomy => {
      if (IS_KB_DEBUG) {
        try {
          checkIntegrity(updatedTaxonomy)
        } catch (error) {
          showBoundary(error)
          return taxonomyRef.current
        }
      }
      taxonomyRef.current = updatedTaxonomy
      setTaxonomy(updatedTaxonomy)
      return updatedTaxonomy
    },
    [IS_KB_DEBUG, checkIntegrity, showBoundary]
  )

  const mutationQueueRef = useRef(Promise.resolve())

  const enqueueTaxonomyMutation = useCallback(
    mutate => {
      const run = mutationQueueRef.current.then(async () => {
        const current = taxonomyRef.current
        const updatedTaxonomy = await mutate(current)
        if (!updatedTaxonomy || updatedTaxonomy === current) return current
        return updateTaxonomy(updatedTaxonomy)
      })
      mutationQueueRef.current = run.catch(() => {})
      return run
    },
    [updateTaxonomy]
  )

  const conceptEditsRefresh = useCallback(
    async (freshConcept, staleConcept, createdChildPayloads = {}) => {
      if (freshConcept === staleConcept) {
        return { concept: freshConcept, taxonomy: taxonomyRef.current }
      }

      let producedTaxonomy = null
      const committedTaxonomy = await enqueueTaxonomyMutation(async current => {
        const aliasesChanged = !isEqual(freshConcept.alternateNames, staleConcept.alternateNames)
        const childrenChanged = !isEqual(freshConcept.children, staleConcept.children)
        const nameChanged = freshConcept.name !== staleConcept.name
        const parentChanged = freshConcept.parent !== staleConcept.parent

        let base = current
        if (parentChanged && !getTaxonomyConcept(current, freshConcept.parent)?.children) {
          const { taxonomy: withParent } = await loadTaxonomyConcept(current, freshConcept.parent, apiFns)
          base = withParent
        }

        const aliasMap = { ...base.aliasMap }
        const conceptMap = { ...base.conceptMap }
        let names = base.names

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

                const payload = createdChildPayloads[childName]
                const child = payload ? { ...payload, aliases: [], children: [] } : await apiConcept(apiFns, childName)
                child.parent = freshConcept.name
                insertConcept(child, conceptMap, aliasMap)
              })
          )

          removedChildren.forEach(childName => {
            const removed = conceptMap[childName]
            if (removed) {
              removed.alternateNames.forEach(aliasName => {
                delete aliasMap[aliasName]
              })
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

        if (nameChanged) {
          freshConcept.children?.forEach(childName => {
            const child = conceptMap[childName]
            if (child && child.parent !== freshConcept.name) {
              insertConcept({ ...child, parent: freshConcept.name }, conceptMap, aliasMap)
            }
          })
        }

        if (aliasesChanged || childrenChanged || nameChanged) {
          names = [...Object.keys(conceptMap), ...Object.keys(aliasMap)].sort()
        }

        producedTaxonomy = { ...base, aliasMap, conceptMap, names }
        return producedTaxonomy
      })

      if (committedTaxonomy !== producedTaxonomy) {
        return { concept: staleConcept, taxonomy: committedTaxonomy }
      }

      return { concept: freshConcept, taxonomy: committedTaxonomy }
    },
    [apiFns, enqueueTaxonomyMutation]
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

  const getConceptPath = useCallback(
    conceptName => {
      if (!taxonomy) return null
      return getTaxonomyConceptPath(taxonomy, conceptName)
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

  const loadConcept = useCallback(
    async (conceptName, force = false) => {
      if (!apiFns || !taxonomyRef.current) return null

      try {
        const committedTaxonomy = await enqueueTaxonomyMutation(async current => {
          if (!force && isTaxonomyConceptLoaded(current, conceptName)) return current
          const { taxonomy: updatedTaxonomy } = await loadTaxonomyConcept(current, conceptName, apiFns)
          return updatedTaxonomy
        })

        const loadedConcept = getTaxonomyConcept(committedTaxonomy, conceptName)
        if (!loadedConcept) {
          throw new Error(`Taxonomy load completed but concept lookup failed: ${conceptName}`)
        }

        return loadedConcept
      } catch (error) {
        showBoundary(error)
        throw error
      }
    },
    [apiFns, enqueueTaxonomyMutation, showBoundary]
  )

  const mediaInFlightRef = useRef(new Set())

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
        enqueueTaxonomyMutation(current => {
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
    [apiFns, enqueueTaxonomyMutation]
  )

  const loadConceptDescendants = useCallback(
    async concept => {
      if (!apiFns || !taxonomyRef.current) return null
      try {
        let mediaNames = []
        const committedTaxonomy = await enqueueTaxonomyMutation(async current => {
          const descendantsResult = await loadTaxonomyConceptDescendants(current, concept, apiFns)
          mediaNames = descendantsResult.mediaNames
          return descendantsResult.taxonomy
        })
        fillConceptMedia(mediaNames)

        return committedTaxonomy
      } catch (error) {
        showBoundary(error)
      }
    },
    [apiFns, enqueueTaxonomyMutation, fillConceptMedia, showBoundary]
  )

  const loadConceptChildren = useCallback(
    async conceptName => {
      if (!apiFns || !taxonomyRef.current) return null
      try {
        return await enqueueTaxonomyMutation(async current => {
          if (areTaxonomyConceptChildrenLoaded(current, conceptName)) return current
          const { taxonomy: updatedTaxonomy } = await loadTaxonomyConceptGrandchildren(current, conceptName, apiFns)
          return updatedTaxonomy
        })
      } catch (error) {
        showBoundary(error)
      }
    },
    [apiFns, enqueueTaxonomyMutation, showBoundary]
  )

  const removeConcept = useCallback(
    conceptName => {
      const current = taxonomyRef.current
      const concept = getTaxonomyConcept(current, conceptName)
      if (!concept) {
        throw new Error(`Cannot remove missing concept from taxonomy: ${conceptName}`)
      }
      const { taxonomy: updatedTaxonomy } = removeTaxonomyConcept(current, concept)
      return updateTaxonomy(updatedTaxonomy)
    },
    [updateTaxonomy]
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
      getConceptPath,
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
      getConceptPath,
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

  if (!taxonomy) {
    return <TaxonomyContext value={value}>{null}</TaxonomyContext>
  }

  return <TaxonomyContext value={value}>{children}</TaxonomyContext>
}

export default TaxonomyProvider
