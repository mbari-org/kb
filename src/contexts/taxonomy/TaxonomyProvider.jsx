import { use, useCallback, useEffect, useRef, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import AuthContext from '@/contexts/auth/AuthContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from './TaxonomyContext'

import ConfigContext from '@/contexts/config/ConfigContext'

import { incompleteTaxonomy } from '@/lib/kb/concept'
import {
  getConcept as getTaxonomyConcept,
  getConceptPendingHistory as getTaxonomyConceptPendingHistory,
  getConceptPrimaryName as getTaxonomyConceptPrimaryName,
  getRoot as getTaxonomyRoot,
  getNames as getTaxonomyNames,
  filterTaxonomyRanks,
  load,
  loadConceptAliases,
  loadTaxonomy,
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

  const loadConcept = async conceptName => {
    const alreadyLoadedConcept = getTaxonomyConcept(taxonomy, conceptName)
    if (alreadyLoadedConcept?.aliases && !incompleteTaxonomy(alreadyLoadedConcept)) {
      return alreadyLoadedConcept
    }

    setLoading(true)

    const { taxonomy: taxonomyWithStructure } = await load(taxonomy, conceptName)
    const concept = getTaxonomyConcept(taxonomyWithStructure, conceptName)
    const { taxonomy: taxonomyWithNames } = await loadConceptAliases(taxonomyWithStructure, concept)

    setTaxonomy(taxonomyWithNames)
    setLoading(false)
    return taxonomyWithNames.concepts[conceptName]
  }

  const loadConceptDescendants = async concept => {
    try {
      setLoading(true)
      const { taxonomy: taxonomyWithDescendants } = await loadConceptDescendants(taxonomy, concept)
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
        getNames,
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
