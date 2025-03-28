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
  getRoot as getTaxonomyRoot,
  getNames as getTaxonomyNames,
  isRoot as isTaxonomyRoot,
  loadTaxonomy,
  loadTaxonomyConcept,
  loadTaxonomyConceptDescendants,
  refreshTaxonomyConcept,
  refreshTaxonomyHistory,
  // cxDebugTaxonomyIntegrity,
} from '@/lib/kb/taxonomy'

import { isAdmin } from '@/lib/auth/role'

const LOADING = 'Loading...'

const TaxonomyProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()

  const { user } = use(AuthContext)
  const { apiFn } = use(ConfigContext)
  const { setProcessing, setModal } = use(ModalContext)

  const [taxonomy, setTaxonomy] = useState(null)

  const initialLoad = useRef(true)

  const apiPayload = apiFn.apiPayload

  const deleteConcept = useCallback(
    conceptName => {
      const { taxonomy: updatedTaxonomy } = deleteTaxonomyConcept(taxonomy, conceptName)
      setTaxonomy(updatedTaxonomy)
    },
    [taxonomy]
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

  const getRoot = useCallback(() => getTaxonomyRoot(taxonomy), [taxonomy])

  const isRoot = useCallback(concept => isTaxonomyRoot(taxonomy, concept), [taxonomy])

  const loadConcept = async conceptName => {
    setProcessing(LOADING)

    const { taxonomy: updatedTaxonomy, wasComplete } = await loadTaxonomyConcept(
      taxonomy,
      conceptName,
      apiPayload
    )

    setProcessing(null)

    if (!wasComplete) {
      setTaxonomy(updatedTaxonomy)
    }

    return updatedTaxonomy.conceptMap[conceptName]
  }

  const loadConceptDescendants = async concept => {
    try {
      setProcessing(LOADING)
      const { taxonomy: taxonomyWithDescendants } = await loadTaxonomyConceptDescendants(
        apiPayload,
        taxonomy,
        concept
      )
      setTaxonomy(taxonomyWithDescendants)
      setProcessing(null)
    } catch (error) {
      setProcessing(null)
      showBoundary(error)
    }
  }

  const refreshConcept = async (concept, updateInfo) => {
    const { concept: updatedConcept, taxonomy: updatedTaxonomy } = await refreshTaxonomyConcept(
      apiPayload,
      taxonomy,
      concept,
      updateInfo
    )
    setTaxonomy(updatedTaxonomy)

    return updatedConcept
  }

  const refreshHistory = async () => {
    const { taxonomy: updatedTaxonomy } = await refreshTaxonomyHistory({ ...taxonomy })
    setTaxonomy(updatedTaxonomy)
  }

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
              title: 'CxInc',
              message: taxonomyError.message,
            })
          } else {
            setTaxonomy(initialTaxonomy)
          }
        },
        error => {
          setProcessing(null)
          showBoundary(error)
        }
      )
    }
  }, [apiPayload, setProcessing, setModal, showBoundary])

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
