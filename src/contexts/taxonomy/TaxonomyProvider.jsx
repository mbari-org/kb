import { use, useEffect, useState } from "react"
import { useErrorBoundary } from "react-error-boundary"

import LoadingContext from "@/contexts/loading/LoadingContext"
import TaxonomyContext from "./TaxonomyContext"

import ConfigContext from "@/contexts/config/ConfigContext"

import {
  getConcept as getTaxonomyConcept,
  load,
  loadTaxonomy,
  loadDescendants,
  needsUpdate,
  updateTaxonomyConcept,
} from "@/model/taxonomy"

const TaxonomyProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()
  const { setLoading } = use(LoadingContext)

  const { error: configError, config } = use(ConfigContext)
  if (configError) {
    console.log("CxTBD TaxonomyProvider config error:", configError)
  }

  const [taxonomy, setTaxonomy] = useState(null)

  const getConcept = conceptName => getTaxonomyConcept(conceptName, taxonomy)

  const loadConcept = async conceptName => {
    const existing = getTaxonomyConcept(conceptName, taxonomy)
    if (needsUpdate(existing)) {
      setLoading(true)
      const { taxonomy: taxonmyWithConcept } = await load(conceptName, taxonomy)
      setLoading(false)
      setTaxonomy(taxonmyWithConcept)
    }
  }

  const loadConceptDescendants = async concept => {
    try {
      setLoading(true)
      const { taxonomy: taxonomyWithDescendants } = await loadDescendants(
        concept,
        taxonomy
      )
      setTaxonomy(taxonomyWithDescendants)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      showBoundary(error)
    }
  }

  const updateConcept = concept => {
    const { taxonomy: updatedTaxonomy } = updateTaxonomyConcept(
      concept,
      taxonomy
    )
    setTaxonomy(updatedTaxonomy)
  }

  useEffect(() => {
    if (config) {
      setLoading(true)
      loadTaxonomy(config).then(
        ({ error: taxonomyError, taxonomy: initialTaxonomy }) => {
          if (taxonomyError) {
            console.error("Handle taxonomy root error:", taxonomyError)
            return
          }
          setTaxonomy(initialTaxonomy)
          setLoading(false)
        },
        error => {
          setLoading(false)
          showBoundary(error)
        }
      )
    }
  }, [config, setLoading, showBoundary])

  if (!taxonomy) {
    return null
  }

  return (
    <TaxonomyContext
      value={{
        getConcept,
        loadConcept,
        loadConceptDescendants,
        taxonomy,
        updateConcept,
      }}
    >
      {children}
    </TaxonomyContext>
  )
}

export default TaxonomyProvider
