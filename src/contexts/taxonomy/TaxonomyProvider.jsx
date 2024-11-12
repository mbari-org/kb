import { use, useEffect, useState } from "react"
import { useErrorBoundary } from "react-error-boundary"

import LoadingContext from "@/contexts/loading/LoadingContext"
import TaxonomyContext from "./TaxonomyContext"

import ConfigContext from "@/contexts/config/ConfigContext"

import {
  getConcept as getTaxonomyContext,
  load,
  loadTaxonomy,
  loadDescendants as loadTaxonomyDescendants,
  needsUpdate,
} from "@/model/taxonomy"

const TaxonomyProvider = ({ children }) => {
  const { showBoundary } = useErrorBoundary()
  const { setLoading } = use(LoadingContext)

  const { error: configError, config } = use(ConfigContext)
  if (configError) {
    console.log("CxTBD TaxonomyProvider config error:", configError)
  }

  const [taxonomy, setTaxonomy] = useState(null)

  const getConcept = conceptName => getTaxonomyContext(taxonomy, conceptName)

  const loadConcept = async conceptName => {
    const existing = getTaxonomyContext(taxonomy, conceptName)
    if (needsUpdate(existing)) {
      setLoading(true)
      const { taxonomy: taxonmyWithConcept } = await load(taxonomy, conceptName)
      setLoading(false)
      setTaxonomy(taxonmyWithConcept)
    }
  }

  const loadDescendants = async concept => {
    try {
      setLoading(true)
      const { taxonomy: taxonomyWithDescendants } =
        await loadTaxonomyDescendants(taxonomy, concept)
      setTaxonomy(taxonomyWithDescendants)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      showBoundary(error)
    }
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
  }, [config, showBoundary])

  if (!taxonomy) {
    return null
  }

  return (
    <TaxonomyContext
      value={{ getConcept, loadDescendants, loadConcept, taxonomy }}
    >
      {children}
    </TaxonomyContext>
  )
}

export default TaxonomyProvider
