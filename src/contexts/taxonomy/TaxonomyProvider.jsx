import { use, useEffect, useState } from "react"

import TaxonomyContext from "./TaxonomyContext"

import ConfigContext from "@/contexts/config/ConfigContext"

import { lineage, load, root } from "@/model/concept"

const TaxonomyProvider = ({ children }) => {
  const { config } = use(ConfigContext)

  const [taxonomy, setTaxonomy] = useState(null)

  const loadConcept = async conceptName => {
    const rootConcept = taxonomy[taxonomy._root]

    if (conceptName === taxonomy._root) {
      return !!rootConcept ? { taxonomy } : load(taxonomy, conceptName)
    }

    return !!rootConcept
      ? load(taxonomy, conceptName)
      : lineage(taxonomy, conceptName)
  }

  useEffect(() => {
    if (!!config) {
      const taxonomyWithConfig = { _config: config }
      root(taxonomyWithConfig).then(({ error, taxonomy: taxonomyWithRoot }) => {
        if (!!error) {
          console.error("Handle taxonomy root error:", error)
        } else {
          setTaxonomy(taxonomyWithRoot)
        }
      })
    }
  }, [config])

  // if (!taxonomy) {
  //   return null
  // }

  return (
    <TaxonomyContext value={{ taxonomy, loadConcept }}>
      {children}
    </TaxonomyContext>
  )
}

export default TaxonomyProvider
