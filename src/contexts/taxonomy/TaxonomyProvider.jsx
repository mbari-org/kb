import { use, useCallback, useEffect, useRef, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import AuthContext from '@/contexts/auth/AuthContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from './TaxonomyContext'

import ConfigContext from '@/contexts/config/ConfigContext'

import { needsUpdate } from '@/lib/kb/concept'
import {
  getConcept as getTaxonomyConcept,
  getConceptNames as getTaxonomyConceptNames,
  getConceptPendingHistory as getTaxonomyConceptPendingHistory,
  getConceptPrimaryName as getTaxonomyConceptPrimaryName,
  getRoot as getTaxonomyRoot,
  filterTaxonomyRanks,
  load,
  loadTaxonomy,
  loadDescendants,
  updateConcept as updateTaxonomyConcept,
  updateConceptName as updateTaxonomyConceptName,
} from '@/lib/kb/taxonomy'

import { isAdmin } from '@/lib/auth/role'

const TaxonomyProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()

  const { user } = use(AuthContext)
  const { config } = use(ConfigContext)
  const { setLoading, setModal } = use(ModalContext)

  const [taxonomy, setTaxonomy] = useState(null)
  const initialLoad = useRef(true)

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

  const getConceptNames = useCallback(() => getTaxonomyConceptNames(taxonomy), [taxonomy])

  const getConceptPendingHistory = useCallback(
    conceptName => getTaxonomyConceptPendingHistory(taxonomy, conceptName),
    [taxonomy]
  )

  const getConceptPrimaryName = useCallback(
    conceptName => getTaxonomyConceptPrimaryName(taxonomy, conceptName),
    [taxonomy]
  )

  const getRoot = useCallback(() => getTaxonomyRoot(taxonomy), [taxonomy])

  const loadConcept = async conceptName => {
    const existing = getTaxonomyConcept(taxonomy, conceptName)
    if (needsUpdate(existing)) {
      setLoading(true)
      const { taxonomy: taxonomyWithConcept } = await load(taxonomy, conceptName)
      setLoading(false)
      setTaxonomy(taxonomyWithConcept)
    }
  }

  const loadConceptDescendants = async concept => {
    try {
      setLoading(true)
      const { taxonomy: taxonomyWithDescendants } = await loadDescendants(taxonomy, concept)
      setTaxonomy(taxonomyWithDescendants)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      showBoundary(error)
    }
  }

  const updateConcept = async concept => {
    if (concept) {
      const { taxonomy: updatedTaxonomy } = await updateTaxonomyConcept(taxonomy, concept)
      setTaxonomy(updatedTaxonomy)
      return updatedTaxonomy
    }
  }

  const updateConceptName = async (concept, updatedName) => {
    if (concept && updatedName) {
      const { taxonomy: updatedTaxonomy } = await updateTaxonomyConceptName(
        taxonomy,
        concept,
        updatedName
      )
      setTaxonomy(updatedTaxonomy)
    }
  }

  useEffect(() => {
    if (initialLoad.current && config) {
      initialLoad.current = false

      setLoading(true)
      loadTaxonomy(config).then(
        ({ error: taxonomyError, taxonomy: initialTaxonomy }) => {
          setLoading(false)
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
          setLoading(false)
          showBoundary(error)
        }
      )
    }
  }, [config, setLoading, setModal, showBoundary])

  if (!taxonomy) {
    return null
  }

  return (
    <TaxonomyContext
      value={{
        filterRanks,
        getConcept,
        getConceptNames,
        getConceptPendingHistory,
        getConceptPrimaryName,
        getRoot,
        loadConcept,
        loadConceptDescendants,
        taxonomy,
        updateConcept,
        updateConceptName,
      }}
    >
      {children}
    </TaxonomyContext>
  )
}

export default TaxonomyProvider
