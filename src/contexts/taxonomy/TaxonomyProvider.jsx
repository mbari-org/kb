import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import AuthContext from '@/contexts/auth/AuthContext'
import AppModalContext from '@/contexts/modal/AppModalContext'
import TaxonomyContext from './TaxonomyContext'

import ConfigContext from '@/contexts/config/ConfigContext'

import {
  deleteConcept as deleteTaxonomyConcept,
  filterTaxonomyRanks,
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

import { PROCESSING } from '@/lib/constants'

const { LOADING } = PROCESSING

const TaxonomyProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()

  const { user } = use(AuthContext)
  const { apiFns } = use(ConfigContext)
  const { setProcessing, setModal } = use(AppModalContext)

  const [taxonomy, setTaxonomy] = useState(null)

  const initialLoad = useRef(true)

  const updateTaxonomy = useCallback(
    taxonomy => {
      cxDebugTaxonomyIntegrity(taxonomy)
      setTaxonomy(taxonomy)
    },
    [setTaxonomy]
  )

  const deleteConcept = useCallback(
    async conceptName => {
      if (!apiFns) return
      const { taxonomy: updatedTaxonomy, selectConceptName } = await deleteTaxonomyConcept(
        taxonomy,
        conceptName,
        apiFns
      )
      updateTaxonomy(updatedTaxonomy)
      return selectConceptName
    },
    [taxonomy, apiFns, updateTaxonomy]
  )

  const filterRanks = useCallback(
    (field, otherValue) => {
      const taxonomyRanks = filterTaxonomyRanks(taxonomy, field, otherValue)
      if (isAdmin(user)) {
        return taxonomyRanks
      }
      return taxonomyRanks.filter(rank => rank !== '')
    },
    [taxonomy, user]
  )

  const getConcept = useCallback(
    conceptName => getTaxonomyConcept(taxonomy, conceptName),
    [taxonomy]
  )

  const getConceptPrimaryName = useCallback(
    conceptName => getTaxonomyConceptPrimaryName(taxonomy, conceptName),
    [taxonomy]
  )

  const getNames = useCallback(() => getTaxonomyNames(taxonomy), [taxonomy])

  const getPendingHistory = useCallback(
    conceptName => getTaxonomyPendingHistory(taxonomy, conceptName),
    [taxonomy]
  )

  const getRootName = useMemo(() => taxonomy?.rootName, [taxonomy?.rootName])

  const isConceptLoaded = useCallback(
    conceptName => isTaxonomyConceptLoaded(taxonomy, conceptName),
    [taxonomy]
  )

  const isDescendant = useCallback(
    (conceptName, descendantName) => isDescendantConcept(taxonomy, conceptName, descendantName),
    [taxonomy]
  )

  const isRoot = useCallback(concept => isTaxonomyRoot(taxonomy, concept), [taxonomy])

  const alreadyLoadingConcept = useRef(false)

  const loadConcept = useCallback(
    async conceptName => {
      if (isConceptLoaded(conceptName)) {
        return getConcept(conceptName)
      }

      if (!apiFns || alreadyLoadingConcept.current) {
        return
      }

      try {
        alreadyLoadingConcept.current = true
        setProcessing(LOADING)

        const { taxonomy: updatedTaxonomy } = await loadTaxonomyConcept(
          taxonomy,
          conceptName,
          apiFns
        )
        updateTaxonomy(updatedTaxonomy)

        const updatedConcept = getTaxonomyConcept(updatedTaxonomy, conceptName)
        setProcessing(null)

        return updatedConcept
      } finally {
        alreadyLoadingConcept.current = false
      }
    },
    [apiFns, getConcept, isConceptLoaded, setProcessing, taxonomy, updateTaxonomy]
  )

  const loadConceptDescendants = useCallback(
    async concept => {
      if (!apiFns) return
      try {
        setProcessing(LOADING)
        const { taxonomy: updatedTaxonomy } = await loadTaxonomyConceptDescendants(
          taxonomy,
          concept,
          apiFns
        )
        updateTaxonomy(updatedTaxonomy)
        setProcessing(null)

        return updatedTaxonomy
      } catch (error) {
        setProcessing(null)
        showBoundary(error)
      }
    },
    [apiFns, setProcessing, showBoundary, taxonomy, updateTaxonomy]
  )

  const refreshConcept = useCallback(
    async (concept, updateInfo) => {
      if (!apiFns) return
      const { concept: updatedConcept, taxonomy: updatedTaxonomy } = await refreshTaxonomyConcept(
        taxonomy,
        concept,
        updateInfo,
        apiFns
      )

      updateTaxonomy(updatedTaxonomy)

      return updatedConcept
    },
    [apiFns, taxonomy, updateTaxonomy]
  )

  const refreshHistory = useCallback(
    async historyType => {
      if (!apiFns) return
      const { taxonomy: updatedTaxonomy } = await refreshTaxonomyHistory(
        taxonomy,
        historyType,
        apiFns
      )
      updateTaxonomy(updatedTaxonomy)
      return updatedTaxonomy
    },
    [apiFns, taxonomy, updateTaxonomy]
  )

  useEffect(() => {
    if (initialLoad.current && apiFns) {
      initialLoad.current = false

      setProcessing(LOADING)
      loadTaxonomy(apiFns).then(
        ({ error: taxonomyError, taxonomy: initialTaxonomy }) => {
          setProcessing(null)
          if (taxonomyError) {
            setModal({
              type: 'error',
              title: 'CxTBD: Error loading taxonomy',
              message: taxonomyError.message,
            })
          } else {
            updateTaxonomy(initialTaxonomy)
          }
        },
        error => {
          setProcessing(null)
          showBoundary(error)
        }
      )
    }
  }, [apiFns, setModal, setProcessing, showBoundary, updateTaxonomy])

  if (!taxonomy) {
    return null
  }

  return (
    <TaxonomyContext
      value={{
        deleteConcept,
        filterRanks,
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
      }}
    >
      {children}
    </TaxonomyContext>
  )
}

export default TaxonomyProvider
