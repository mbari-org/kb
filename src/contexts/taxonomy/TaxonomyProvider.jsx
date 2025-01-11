import { use, useCallback, useEffect, useState } from "react"
import { useErrorBoundary } from "react-error-boundary"

import ModalContext from "@/contexts/modal/ModalContext"
import TaxonomyContext from "./TaxonomyContext"

import ConfigContext from "@/contexts/config/ConfigContext"

import {
  getConcept as getTaxonomyConcept,
  getConceptNames as getTaxonomyConceptNames,
  getConceptPendingHistory as getTaxonomyConceptPendingHistory,
  getConceptPrimaryName as getTaxonomyConceptPrimaryName,
  load,
  loadTaxonomy,
  loadDescendants,
  needsUpdate,
  updateConcept as updateTaxonomyConcept,
  updateConceptName as updateTaxonomyConceptName,
} from "@/lib/kb/taxonomy"

const TaxonomyProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()
  const { setLoading, setModalAlert } = use(ModalContext)

  const { error: configError, config } = use(ConfigContext)
  if (configError) {
    console.log("CxTBD TaxonomyProvider config error:", configError)
  }

  const [taxonomy, setTaxonomy] = useState(null)

  const getConcept = useCallback(
    conceptName => getTaxonomyConcept(taxonomy, conceptName),
    [taxonomy]
  )

  const getConceptNames = useCallback(
    () => getTaxonomyConceptNames(taxonomy),
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

  const loadConcept = async conceptName => {
    const existing = getTaxonomyConcept(taxonomy, conceptName)
    if (needsUpdate(existing)) {
      setLoading(true)
      const { taxonomy: taxonmyWithConcept } = await load(taxonomy, conceptName)
      setLoading(false)
      setTaxonomy(taxonmyWithConcept)
    }
  }

  const loadConceptDescendants = async concept => {
    if (!concept) {
      console.log("CxTBD TaxonomyProvider loadConceptDescendants w/o concept")
    }
    try {
      setLoading(true)
      console.log(
        "CxTBD TaxonomyProvider loadConceptDescendants concept:",
        concept?.name
      )
      const { taxonomy: taxonomyWithDescendants } = await loadDescendants(
        taxonomy,
        concept
      )
      console.log(
        "CxTBD TaxonomyProvider loadConceptDescendants DONE for concept:",
        concept?.name
      )
      setTaxonomy(taxonomyWithDescendants)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      showBoundary(error)
    }
  }

  const updateConcept = async concept => {
    if (concept) {
      const { taxonomy: updatedTaxonomy } = await updateTaxonomyConcept(
        taxonomy,
        concept
      )
      setTaxonomy(updatedTaxonomy)
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
    if (config) {
      setLoading(true)
      loadTaxonomy(config).then(
        ({ error: taxonomyError, taxonomy: initialTaxonomy }) => {
          setLoading(false)
          if (taxonomyError) {
            setModalAlert({
              type: "error",
              title: "CxInc",
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
  }, [config, setLoading, setModalAlert, showBoundary])

  if (!taxonomy) {
    return null
  }

  return (
    <TaxonomyContext
      value={{
        getConcept,
        getConceptNames,
        getConceptPendingHistory,
        getConceptPrimaryName,
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
