import { use, useEffect, useState } from "react"

import TaxonomyContext from "./TaxonomyContext"

import ConfigContext from "@/contexts/config/ConfigContext"

import { lineage, load } from "@/model/concept"

// import taxonomyWithConcept from "./taxonomyWithConcept"
import loadTaxonomyRoot from "./loadTaxonomyRoot"

const TaxonomyProvider = ({ children }) => {
  const { config } = use(ConfigContext)

  const [taxonomy, setTaxonomy] = useState(null)

  const loadConcept = async conceptName => {
    let concept = taxonomy[conceptName]
    if (!concept || !concept.children) {
      const { error, taxonomy: taxonomyWithConcept } = await load(
        taxonomy,
        conceptName
      )
      if (!!error) {
        console.error("Handle loadConcept error:", error)
        return { error }
      } else {
        setTaxonomy(taxonomyWithConcept)
        return { taxonomy: taxonomyWithConcept }
      }
    }
  }

  useEffect(() => {
    if (!!config) {
      loadTaxonomyRoot(config).then(({ error, taxonomy: initialTaxonomy }) => {
        if (!!error) {
          console.error("Handle taxonomy root error:", error)
        } else {
          setTaxonomy(initialTaxonomy)
        }
      })
    }
  }, [config])

  return (
    <TaxonomyContext value={{ taxonomy, loadConcept }}>
      {children}
    </TaxonomyContext>
  )
}

export default TaxonomyProvider
