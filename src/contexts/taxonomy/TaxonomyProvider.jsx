import { use, useEffect, useState } from "react"
import { useErrorBoundary } from "react-error-boundary"

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

  const { error: configError, config } = use(ConfigContext)
  if (configError) {
    console.log("CxTBD TaxonomyProvider config error:", error)
  }

  const [taxonomy, setTaxonomy] = useState(null)

  const getConcept = conceptName => getTaxonomyContext(taxonomy, conceptName)

  const loadConcept = async conceptName => {
    const existing = getTaxonomyContext(taxonomy, conceptName)
    if (needsUpdate(existing)) {
      const { taxonomy: taxonmyWithConcept } = await load(taxonomy, conceptName)
      setTaxonomy(taxonmyWithConcept)
    }
  }

  const loadDescendants = async concept => {
    try {
      const { taxonomy: taxonomyWithDescendants } =
        await loadTaxonomyDescendants(taxonomy, concept)
      setTaxonomy(taxonomyWithDescendants)
    } catch (error) {
      showBoundary(error)
    }
  }

  useEffect(() => {
    if (config) {
      loadTaxonomy(config).then(
        ({ error: taxonomyError, taxonomy: initialTaxonomy }) => {
          if (taxonomyError) {
            console.error("Handle taxonomy root error:", taxonomyError)
            return
          }
          setTaxonomy(initialTaxonomy)
        },
        error => {
          showBoundary(error)
        }
      )
    }
  }, [config])

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
