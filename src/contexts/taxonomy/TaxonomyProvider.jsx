import { use, useEffect, useState } from "react"

import TaxonomyContext from "./TaxonomyContext"

import ConfigContext from "@/contexts/config/ConfigContext"

import { lineage, load } from "@/model/concept"

import taxonomyWithConcept from "./taxonomyWithConcept"
import taxonomyWithRoot from "./taxonomyWithRoot"

const TaxonomyProvider = ({ children }) => {
  const { config } = use(ConfigContext)

  const [taxonomy, setTaxonomy] = useState(null)

  const loadConcept = async conceptName => {
    const concept = taxonomy[conceptName]
    if (!concept) {
      const root = taxonomy[taxonomy._root_]
      const loadFn = conceptName === taxonomy._root_ || !!root ? load : lineage

      const { error, taxonomy: updatedTaxonomy } = await loadFn(
        taxonomy,
        conceptName
      )
      if (!!error) {
        console.error("Handle loadConcept error:", error)
        return { error }
      } else {
        setTaxonomy(updatedTaxonomy)
        return { updatedTaxonomy }
      }
    }
  }

  useEffect(() => {
    if (!!config) {
      taxonomyWithRoot(config).then(({ error, taxonomy: initialTaxonomy }) => {
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
