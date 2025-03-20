import { use, useCallback, useEffect, useRef, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import AuthContext from '@/contexts/auth/AuthContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from './TaxonomyContext'

import ConfigContext from '@/contexts/config/ConfigContext'

import { incompleteTaxonomy } from '@/lib/kb/concept'
import {
  deleteConcept as deleteTaxonomyConcept,
  getConcept as getTaxonomyConcept,
  getConceptPendingHistory as getTaxonomyConceptPendingHistory,
  getConceptPrimaryName as getTaxonomyConceptPrimaryName,
  getRoot as getTaxonomyRoot,
  getNames as getTaxonomyNames,
  filterTaxonomyRanks,
  load,
  loadConceptAliases,
  loadTaxonomy,
  refreshConcept as refreshTaxonomyConcept,
  refreshHistory as refreshTaxonomyHistory,
} from '@/lib/kb/taxonomy'

import { isAdmin } from '@/lib/auth/role'

const LOADING = 'Loading...'

const TaxonomyProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()

  const { user } = use(AuthContext)
  const { config } = use(ConfigContext)
  const { setProcessing, setModal } = use(ModalContext)

  const [taxonomy, setTaxonomy] = useState(null)
  const [taxonomyNames, setTaxonomyNames] = useState([])
  const [taxonomyRoot, setTaxonomyRoot] = useState(null)

  const initialLoad = useRef(true)

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

  const loadConcept = async (conceptName, refresh = false) => {
    if (!refresh) {
      const alreadyLoadedConcept = getTaxonomyConcept(taxonomy, conceptName)
      if (alreadyLoadedConcept?.aliases && !incompleteTaxonomy(alreadyLoadedConcept)) {
        return alreadyLoadedConcept
      }
    }

    setProcessing(LOADING)

    const { taxonomy: taxonomyWithStructure } = await load(taxonomy, conceptName)
    const concept = getTaxonomyConcept(taxonomyWithStructure, conceptName)
    const { taxonomy: taxonomyWithNames } = await loadConceptAliases(taxonomyWithStructure, concept)

    setTaxonomy(taxonomyWithNames)
    setProcessing(null)
    return taxonomyWithNames.concepts[conceptName]
  }

  const loadConceptDescendants = async concept => {
    try {
      setProcessing(LOADING)
      const { taxonomy: taxonomyWithDescendants } = await loadConceptDescendants(taxonomy, concept)
      setTaxonomy(taxonomyWithDescendants)
      setProcessing(null)
    } catch (error) {
      setProcessing(null)
      showBoundary(error)
    }
  }

  const refreshConcept = async conceptName => {
    const { taxonomy: refreshedTaxonomy } = await refreshTaxonomyConcept(taxonomy, conceptName)
    setTaxonomy(refreshedTaxonomy)
  }

  const refreshHistory = async () => {
    const { taxonomy: refreshedTaxonomy } = await refreshTaxonomyHistory(taxonomy)
    setTaxonomy(refreshedTaxonomy)
  }

  useEffect(() => {
    setTaxonomyNames(getTaxonomyNames(taxonomy))
    setTaxonomyRoot(getTaxonomyRoot(taxonomy))
  }, [taxonomy])

  useEffect(() => {
    if (initialLoad.current && config) {
      initialLoad.current = false

      setProcessing(LOADING)
      loadTaxonomy(config).then(
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
  }, [config, setProcessing, setModal, showBoundary])

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
        loadConcept,
        loadConceptDescendants,
        refreshConcept,
        refreshHistory,
        taxonomy,
        taxonomyNames,
        taxonomyRoot,
      }}
    >
      {children}
    </TaxonomyContext>
  )
}

export default TaxonomyProvider
