import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import UserContext from '@/contexts/user/UserContext'
import TaxonomyContext from './TaxonomyContext'

import ConfigContext from '@/contexts/config/ConfigContext'

import { getConcept as apiConcept } from '@/lib/api/concept'

import {
  closestConcept as closestTaxonomyConcept,
  deleteConcept as deleteTaxonomyConcept,
  filterTaxonomyRanks,
  getAncestors as getTaxonomyAncestors,
  getConcept as getTaxonomyConcept,
  getConceptPrimaryName as getTaxonomyConceptPrimaryName,
  getNames as getTaxonomyNames,
  isConceptLoaded as isTaxonomyConceptLoaded,
  isDescendant as isDescendantConcept,
  isRoot as isTaxonomyRoot,
  loadTaxonomy,
  loadTaxonomyConcept,
  loadTaxonomyConceptDescendants,
  mapConcept,
  // refreshTaxonomyConcept,
  removeTaxonomyConcept,
  cxDebugTaxonomyIntegrity,
} from '@/lib/kb/model/taxonomy'

import { isAdmin } from '@/lib/auth/role'

import { isEqual } from '@/lib/utils'

// Load initial taxonomy with root concept and its children
const loadInitialTaxonomy = async apiFns => {
  try {
    // First load the basic taxonomy
    const { taxonomy: basicTaxonomy } = await loadTaxonomy(apiFns)

    // Then load the root concept with its children
    return loadTaxonomyConcept(basicTaxonomy, basicTaxonomy.rootName, apiFns)
  } catch (error) {
    return { error }
  }
}

const TaxonomyProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()

  const { user } = use(UserContext)
  const { apiFns } = use(ConfigContext)

  const [taxonomy, setTaxonomy] = useState(null)

  const updateTaxonomy = useCallback(taxonomy => {
    cxDebugTaxonomyIntegrity(taxonomy)
    setTaxonomy(taxonomy)
  }, [])

  const closestConcept = useCallback(
    concept => closestTaxonomyConcept(taxonomy, concept),
    [taxonomy]
  )

  const deleteConcept = useCallback(
    async concept => {
      const result = await deleteTaxonomyConcept(taxonomy, concept, apiFns)
      updateTaxonomy(result.updatedTaxonomy)
      return result
    },
    [apiFns, taxonomy, updateTaxonomy]
  )

  const filterRanks = useCallback(
    (field, otherValue) => {
      if (!taxonomy) return []
      const taxonomyRanks = filterTaxonomyRanks(taxonomy, field, otherValue)
      if (isAdmin(user)) {
        return taxonomyRanks
      }
      return taxonomyRanks.filter(rank => rank !== '')
    },
    [taxonomy, user]
  )

  const getConcept = useCallback(
    conceptName => {
      if (!taxonomy) return null
      return getTaxonomyConcept(taxonomy, conceptName)
    },
    [taxonomy]
  )

  const getConceptPrimaryName = useCallback(
    conceptName => {
      if (!taxonomy) return null
      return getTaxonomyConceptPrimaryName(taxonomy, conceptName)
    },
    [taxonomy]
  )

  const getAncestors = useCallback(
    conceptName => {
      if (!taxonomy) return []
      return getTaxonomyAncestors(taxonomy, conceptName)
    },
    [taxonomy]
  )

  const getNames = useCallback(() => {
    if (!taxonomy) return []
    return getTaxonomyNames(taxonomy)
  }, [taxonomy])

  const getRootName = useMemo(() => taxonomy?.rootName, [taxonomy?.rootName])

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

  const alreadyLoadingConcept = useRef(false)

  const loadConcept = useCallback(
    async conceptName => {
      if (!taxonomy || !apiFns) return null

      if (isConceptLoaded(conceptName)) {
        return getConcept(conceptName)
      }

      if (alreadyLoadingConcept.current) {
        return null
      }

      try {
        alreadyLoadingConcept.current = true

        const { taxonomy: updatedTaxonomy } = await loadTaxonomyConcept(
          taxonomy,
          conceptName,
          apiFns
        )

        updateTaxonomy(updatedTaxonomy)

        const updatedConcept = getTaxonomyConcept(updatedTaxonomy, conceptName)
        return updatedConcept
      } catch (error) {
        showBoundary(error)
      } finally {
        alreadyLoadingConcept.current = false
      }
    },
    [apiFns, getConcept, isConceptLoaded, taxonomy, updateTaxonomy, showBoundary]
  )

  const loadConceptDescendants = useCallback(
    async concept => {
      if (!apiFns || !taxonomy) return null
      try {
        const { taxonomy: updatedTaxonomy } = await loadTaxonomyConceptDescendants(
          taxonomy,
          concept,
          apiFns
        )
        updateTaxonomy(updatedTaxonomy)

        return updatedTaxonomy
      } catch (error) {
        showBoundary(error)
      }
    },
    [apiFns, showBoundary, taxonomy, updateTaxonomy]
  )

  // const replaceConcept = useCallback(
  //   (concept, freshConcept) => {
  //     if (freshConcept.name === concept.name) {
  //       let aliasMap = taxonomy.aliasMap
  //       if (!isEqual(freshConcept.alternateNames, concept.alternateNames)) {
  //         aliasMap = { ...taxonomy.aliasMap }
  //         concept.alternateNames.forEach(alternateName => {
  //           delete aliasMap[alternateName]
  //         })
  //         freshConcept.alternateNames.forEach(alternateName => {
  //           aliasMap[alternateName] = freshConcept.name
  //         })
  //       }
  //       const conceptMap = { ...taxonomy.conceptMap }
  //       conceptMap[freshConcept.name] = freshConcept
  //       return { taxonomy: { ...taxonomy, aliasMap, conceptMap } }
  //     }

  //     const { taxonomy: freshTaxonomy } = removeTaxonomyConcept(taxonomy, concept)

  //     mapConcept(freshConcept, freshTaxonomy.conceptMap, freshTaxonomy.aliasMap)

  //     const parent = { ...getTaxonomyConcept(freshTaxonomy, freshConcept.parent) }
  //     parent.children = parent.children.filter(child => child !== freshConcept.name)
  //     parent.children.push(freshConcept.name)
  //     parent.children.sort()
  //     mapConcept(parent, freshTaxonomy.conceptMap, freshTaxonomy.aliasMap)

  //     freshConcept.children.forEach(child => {
  //       const childConcept = { ...getTaxonomyConcept(freshTaxonomy, child) }
  //       childConcept.parent = freshConcept.name
  //       mapConcept(childConcept, freshTaxonomy.conceptMap, freshTaxonomy.aliasMap)
  //     })

  //     return { taxonomy: freshTaxonomy }
  //   },
  //   [taxonomy]
  // )

  const refreshConcept = useCallback(
    async (staleConcept, freshConcept) => {
      const aliasMap = { ...taxonomy.aliasMap }
      const conceptMap = { ...taxonomy.conceptMap }

      delete conceptMap[staleConcept.name]
      staleConcept.alternateNames.forEach(alternateName => {
        delete aliasMap[alternateName]
      })

      mapConcept(freshConcept, conceptMap, aliasMap)

      if (freshConcept.name !== staleConcept.name) {
        delete conceptMap[staleConcept.name]
        staleConcept.alternateNames.forEach(alternateName => {
          delete aliasMap[alternateName]
        })
        const freshParent = { ...conceptMap[freshConcept.parent] }
        freshParent.children = freshParent.children.filter(child => child !== staleConcept.name)
        freshParent.children.push(freshConcept.name)
        freshParent.children.sort()
        mapConcept(freshParent, conceptMap, aliasMap)
      }

      if (freshConcept.parent !== staleConcept.parent) {
        const freshParent = { ...conceptMap[freshConcept.parent] }
        freshParent.children.push(freshConcept.name)
        freshParent.children.sort()
        mapConcept(freshParent, conceptMap, aliasMap)

        const staleParent = { ...conceptMap[staleConcept.parent] }
        staleParent.children = staleParent.children.filter(child => child !== staleConcept.name)
        mapConcept(staleParent, conceptMap, aliasMap)
      }

      if (!isEqual(freshConcept.children, staleConcept.children)) {
        await Promise.all(
          freshConcept.children
            .filter(childName => childName !== staleConcept.name)
            .map(async childName => {
              const child = await apiFns.apiPayload(apiConcept, childName)
              child.parent = freshConcept.name
              mapConcept(child, conceptMap, aliasMap)
            })
        )
      }

      const updatedTaxonomy = { ...taxonomy, aliasMap, conceptMap }

      updateTaxonomy(updatedTaxonomy)

      return { concept: freshConcept, taxonomy: updatedTaxonomy }
    },
    [apiFns, taxonomy, updateTaxonomy]
  )

  const renameConcept = useCallback(
    async (oldConcept, newConcept) => {
      const { taxonomy: updatedTaxonomy } = removeTaxonomyConcept(taxonomy, oldConcept)

      mapConcept(newConcept, updatedTaxonomy.conceptMap, updatedTaxonomy.aliasMap)

      const parent = getTaxonomyConcept(updatedTaxonomy, newConcept.parent)
      parent.children.push(newConcept.name)
      parent.children.sort()
      mapConcept(parent, updatedTaxonomy.conceptMap, updatedTaxonomy.aliasMap)

      updateTaxonomy(updatedTaxonomy)

      return { concept: newConcept, taxonomy: updatedTaxonomy }
    },
    [taxonomy, updateTaxonomy]
  )

  const removeConcept = useCallback(
    conceptName => {
      const concept = getConcept(conceptName)
      const { taxonomy: updatedTaxonomy } = removeTaxonomyConcept(taxonomy, concept)
      updateTaxonomy(updatedTaxonomy)
      return updatedTaxonomy
    },
    [getConcept, taxonomy, updateTaxonomy]
  )

  useEffect(() => {
    if (!apiFns || taxonomy) return

    loadInitialTaxonomy(apiFns).then(
      ({ error: taxonomyError, taxonomy: initialTaxonomy }) => {
        if (taxonomyError) {
          showBoundary(taxonomyError)
        } else {
          setTaxonomy(initialTaxonomy)
        }
      },
      error => {
        showBoundary(error)
      }
    )
  }, [apiFns, taxonomy, showBoundary])

  const value = useMemo(
    () => ({
      closestConcept,
      deleteConcept,
      filterRanks,
      getConcept,
      getConceptPrimaryName,
      getAncestors,
      getNames,
      getRootName,
      isConceptLoaded,
      isDescendant,
      isRoot,
      loadConcept,
      loadConceptDescendants,
      refreshConcept,
      renameConcept,
      removeConcept,
      taxonomy,
    }),
    [
      closestConcept,
      deleteConcept,
      filterRanks,
      getAncestors,
      getConcept,
      getConceptPrimaryName,
      getNames,
      getRootName,
      isConceptLoaded,
      isDescendant,
      isRoot,
      loadConcept,
      loadConceptDescendants,
      refreshConcept,
      renameConcept,
      removeConcept,
      taxonomy,
    ]
  )

  // Don't render children until taxonomy is loaded
  if (!taxonomy) {
    return <TaxonomyContext value={value}>{null}</TaxonomyContext>
  }

  return <TaxonomyContext value={value}>{children}</TaxonomyContext>
}

export default TaxonomyProvider
