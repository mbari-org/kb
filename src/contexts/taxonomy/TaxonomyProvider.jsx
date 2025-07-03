import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import UserContext from '@/contexts/user/UserContext'
import TaxonomyContext from './TaxonomyContext'

import ConfigContext from '@/contexts/config/ConfigContext'

import {
  deleteConcept as deleteTaxonomyConcept,
  filterTaxonomyRanks,
  getAncestors as getTaxonomyAncestors,
  getConcept as getTaxonomyConcept,
  getConceptPrimaryName as getTaxonomyConceptPrimaryName,
  getNames as getTaxonomyNames,
  getPendingHistory as getTaxonomyPendingHistory,
  isConceptLoaded as isTaxonomyConceptLoaded,
  isDescendant as isDescendantConcept,
  isRoot as isTaxonomyRoot,
  loadTaxonomy,
  loadTaxonomyConcept,
  loadTaxonomyConceptDescendants,
  refreshHistory as refreshTaxonomyHistory,
  refreshTaxonomyConcept,
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

  const deleteConcept = useCallback(
    async conceptName => {
      if (!apiFns || !taxonomy) return
      try {
        const { taxonomy: updatedTaxonomy, selectConceptName } = await deleteTaxonomyConcept(
          taxonomy,
          conceptName,
          apiFns
        )
        updateTaxonomy(updatedTaxonomy)
        return selectConceptName
      } catch (error) {
        showBoundary(error)
      }
    },
    [taxonomy, apiFns, updateTaxonomy, showBoundary]
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

  const getPendingHistory = useCallback(
    conceptName => {
      if (!taxonomy) return []
      return getTaxonomyPendingHistory(taxonomy, conceptName)
    },
    [taxonomy]
  )

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
    async (concept, updateInfo) => {
      if (!apiFns || !taxonomy) return null

      try {
        const { concept: updatedConcept, taxonomy: updatedTaxonomy } = await refreshTaxonomyConcept(
          taxonomy,
          concept,
          updateInfo,
          apiFns
        )

        updateTaxonomy(updatedTaxonomy)

        return updatedConcept
      } catch (error) {
        showBoundary(error)
      }
    },
    [apiFns, taxonomy, updateTaxonomy, showBoundary]
  )

  const refreshHistory = useCallback(
    async historyType => {
      if (!apiFns || !taxonomy) return null
      try {
        const { taxonomy: updatedTaxonomy } = await refreshTaxonomyHistory(
          taxonomy,
          historyType,
          apiFns
        )
        updateTaxonomy(updatedTaxonomy)
        return updatedTaxonomy
      } catch (error) {
        showBoundary(error)
      }
    },
    [apiFns, taxonomy, updateTaxonomy, showBoundary]
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
      deleteConcept,
      filterRanks,
      getConcept,
      getConceptPrimaryName,
      getAncestors,
      getNames,
      getPendingHistory,
      getRootName,
      isConceptLoaded,
      isDescendant,
      isRoot,
      loadConcept,
      loadConceptDescendants,
      refreshConcept,
      refreshHistory,
      taxonomy,
    }),
    [
      deleteConcept,
      filterRanks,
      getAncestors,
      getConcept,
      getConceptPrimaryName,
      getNames,
      getPendingHistory,
      getRootName,
      isConceptLoaded,
      isDescendant,
      isRoot,
      loadConcept,
      loadConceptDescendants,
      refreshConcept,
      refreshHistory,
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
