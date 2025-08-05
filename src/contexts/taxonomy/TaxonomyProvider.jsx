import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import UserContext from '@/contexts/user/UserContext'
import TaxonomyContext from './TaxonomyContext'

import ConfigContext from '@/contexts/config/ConfigContext'

import { loadConcept as apiLoadConcept } from '@/lib/kb/model/concept'

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
  refreshTaxonomyConcept,
  removeTaxonomyConcept,
  cxDebugTaxonomyIntegrity,
} from '@/lib/kb/model/taxonomy'

import { isAdmin } from '@/lib/auth/role'

// Load initial taxonomy with root concept and its children
const loadInitialTaxonomy = async apiFns => {
  try {
    // First load the basic taxonomy
    const { taxonomy: basicTaxonomy } = await loadTaxonomy(apiFns)

    // Then load the root concept with its children
    const { taxonomy: taxonomyWithRoot } = await loadTaxonomyConcept(
      basicTaxonomy,
      basicTaxonomy.rootName,
      apiFns
    )

    return { taxonomy: taxonomyWithRoot }
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

  const refreshConcept = useCallback(
    async (concept, updatesInfo) => {
      if (!apiFns || !taxonomy) return null

      const { concept: updatedConcept, taxonomy: updatedTaxonomy } = await refreshTaxonomyConcept(
        taxonomy,
        concept,
        updatesInfo,
        apiFns
      )

      updateTaxonomy(updatedTaxonomy)

      return { concept: updatedConcept, taxonomy: updatedTaxonomy }
    },
    [apiFns, taxonomy, updateTaxonomy]
  )

  const renameConcept = useCallback(
    async (concept, updatesInfo) => {
      const { updatedValue } = updatesInfo

      const { taxonomy: taxonomySansConcept } = removeTaxonomyConcept(taxonomy, concept)

      const newConceptName = updatedValue('name')

      const loadedConcept = await apiLoadConcept(newConceptName, apiFns)
      loadedConcept.parent = concept.parent
      mapConcept(loadedConcept, taxonomySansConcept.conceptMap, taxonomySansConcept.aliasMap)

      const parent = { ...getTaxonomyConcept(taxonomySansConcept, concept.parent) }
      parent.children = parent.children.filter(child => child !== concept.name)
      parent.children.push(newConceptName)
      mapConcept(parent, taxonomySansConcept.conceptMap, taxonomySansConcept.aliasMap)

      concept.children.forEach(child => {
        const childConcept = { ...getTaxonomyConcept(taxonomySansConcept, child) }
        childConcept.parent = newConceptName
        mapConcept(childConcept, taxonomySansConcept.conceptMap, taxonomySansConcept.aliasMap)
      })

      const { concept: updatedConcept, taxonomy: updatedTaxonomy } = await refreshTaxonomyConcept(
        taxonomySansConcept,
        loadedConcept,
        updatesInfo,
        apiFns
      )

      updateTaxonomy(updatedTaxonomy)

      return { concept: updatedConcept, taxonomy: updatedTaxonomy }
    },
    [apiFns, taxonomy, updateTaxonomy]
  )

  const removeConcept = useCallback(
    concept => {
      const { taxonomy: updatedTaxonomy } = removeTaxonomyConcept(taxonomy, concept)
      updateTaxonomy(updatedTaxonomy)
      return updatedTaxonomy
    },
    [taxonomy, updateTaxonomy]
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
