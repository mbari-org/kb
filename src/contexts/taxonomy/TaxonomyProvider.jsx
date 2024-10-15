import { use, useEffect, useState } from "react"
import { useErrorBoundary } from "react-error-boundary"

import TaxonomyContext from "./TaxonomyContext"

import ConfigContext from "@/contexts/config/ConfigContext"

import {
  getConcept as getTaxonomyContext,
  load,
  loadTaxonomy,
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
    if (!needsUpdate(existing)) {
      return {}
    }

    const { error: loadError, taxonomy: taxonmyWithConcept } = await load(
      taxonomy,
      conceptName
    )

    if (loadError) {
      return { error: loadError }
    }
    setTaxonomy(taxonmyWithConcept)

    return {}
  }

  useEffect(() => {
    if (config) {
      loadTaxonomy(config).then(
        ({ error: taxonomyError, taxonomy: initialTaxonomy }) => {
          if (taxonomyError) {
            console.error("Handle taxonomy root error:", rootError)
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
    <TaxonomyContext value={{ getConcept, loadConcept, taxonomy }}>
      {children}
    </TaxonomyContext>
  )
}

export default TaxonomyProvider
