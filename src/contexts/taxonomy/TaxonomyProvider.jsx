import { use, useCallback, useEffect, useRef, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import AuthContext from '@/contexts/auth/AuthContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from './TaxonomyContext'

import ConfigContext from '@/contexts/config/ConfigContext'

import {
  deleteConcept as deleteTaxonomyConcept,
  filterTaxonomyRanks,
  getConcept as getTaxonomyConcept,
  getConceptPendingHistory as getTaxonomyConceptPendingHistory,
  getConceptPrimaryName as getTaxonomyConceptPrimaryName,
  getNames as getTaxonomyNames,
  getRoot as getTaxonomyRoot,
  isConceptLoaded as isTaxonomyConceptLoaded,
  isDescendant as isDescendantConcept,
  isRoot as isTaxonomyRoot,
  loadTaxonomy,
  loadTaxonomyConcept,
  loadTaxonomyConceptDescendants,
  refreshTaxonomyConcept,
  refreshTaxonomyPendingHistory,
  cxDebugTaxonomyIntegrity,
} from '@/lib/kb/model/taxonomy'

import { isAdmin } from '@/lib/auth/role'

import { PROCESSING } from '@/lib/constants'

const { LOADING } = PROCESSING

const TaxonomyProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()

  const { user } = use(AuthContext)
  const { apiFns } = use(ConfigContext)
  const { setProcessing, setModal } = use(ModalContext)

  const [taxonomy, setTaxonomy] = useState(null)

  const initialLoad = useRef(true)

  const apiPayload = apiFns.apiPayload

  const updateTaxonomy = useCallback(
    taxonomy => {
      cxDebugTaxonomyIntegrity(taxonomy)
      setTaxonomy(taxonomy)
    },
    [setTaxonomy]
  )

  const deleteConcept = useCallback(
    async conceptName => {
      const { taxonomy: updatedTaxonomy, selectConceptName } = await deleteTaxonomyConcept(
        taxonomy,
        conceptName,
        apiPayload
      )
      updateTaxonomy(updatedTaxonomy)
      return selectConceptName
    },
    [taxonomy, apiPayload, updateTaxonomy]
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

  const getConceptPendingHistory = useCallback(
    conceptName => getTaxonomyConceptPendingHistory(taxonomy, conceptName),
    [taxonomy]
  )

  const getConceptPrimaryName = useCallback(
    conceptName => getTaxonomyConceptPrimaryName(taxonomy, conceptName),
    [taxonomy]
  )

  const getNames = useCallback(() => getTaxonomyNames(taxonomy), [taxonomy])

  const getRoot = useCallback(
    () => getTaxonomyRoot(taxonomy?.conceptMap, taxonomy?.rootName),
    [taxonomy?.conceptMap, taxonomy?.rootName]
  )

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
      if (alreadyLoadingConcept.current) {
        return
      }

      try {
        alreadyLoadingConcept.current = true
        setProcessing(LOADING)

        const { taxonomy: updatedTaxonomy } = await loadTaxonomyConcept(
          taxonomy,
          conceptName,
          apiPayload
        )
        updateTaxonomy(updatedTaxonomy)

        setProcessing(null)

        return updatedTaxonomy.conceptMap[conceptName]
      } finally {
        alreadyLoadingConcept.current = false
      }
    },
    [apiPayload, setProcessing, taxonomy, updateTaxonomy]
  )

  const loadConceptDescendants = useCallback(
    async concept => {
      try {
        setProcessing(LOADING)
        const { taxonomy: updatedTaxonomy } = await loadTaxonomyConceptDescendants(
          taxonomy,
          concept,
          apiPayload
        )
        updateTaxonomy(updatedTaxonomy)
        setProcessing(null)

        return updatedTaxonomy
      } catch (error) {
        setProcessing(null)
        showBoundary(error)
      }
    },
    [apiPayload, setProcessing, showBoundary, taxonomy, updateTaxonomy]
  )

  const refreshConcept = useCallback(
    async (concept, updateInfo) => {
      const { concept: updatedConcept, taxonomy: updatedTaxonomy } = await refreshTaxonomyConcept(
        taxonomy,
        concept,
        updateInfo,
        apiPayload
      )

      updateTaxonomy(updatedTaxonomy)

      return updatedConcept
    },
    [taxonomy, apiPayload, updateTaxonomy]
  )

  const refreshHistory = useCallback(async () => {
    const { taxonomy: updatedTaxonomy } = await refreshTaxonomyPendingHistory(apiPayload, {
      ...taxonomy,
    })
    updateTaxonomy(updatedTaxonomy)
  }, [apiPayload, taxonomy, updateTaxonomy])

  useEffect(() => {
    if (initialLoad.current && apiPayload) {
      initialLoad.current = false

      setProcessing(LOADING)
      loadTaxonomy(apiPayload).then(
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
  }, [apiPayload, setModal, setProcessing, showBoundary, updateTaxonomy])

  if (!taxonomy) {
    return null
  }

  return (
    <TaxonomyContext
      value={{
        deleteConcept,
        filterRanks,
        getConcept,
        getConceptPendingHistory,
        getConceptPrimaryName,
        getNames,
        getRoot,
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
