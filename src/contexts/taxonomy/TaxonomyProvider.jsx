import { use, useEffect, useState } from "react"

import TaxonomyContext from "./TaxonomyContext"

import ConfigContext from "@/contexts/config/ConfigContext"

import { lineage, load } from "@/model/concept"

const TaxonomyProvider = ({ children }) => {
  const { config } = use(ConfigContext)

  const [taxonomy, setTaxonomy] = useState(null)

  const loadConcept = conceptName => {
    console.log("load ", conceptName)
  }

  useEffect(() => {
    if (!!config) {
      setTaxonomy({ _config: config })
      // lineage(initialTaxonomy, user.concept).then(({ taxonomy }) => {
      //   setTaxonomy(taxonomy)
      // })
    }
  }, [config])

  // if (!config) {
  //   return null
  // }

  return (
    <TaxonomyContext value={{ taxonomy, loadConcept }}>
      {children}
    </TaxonomyContext>
  )
}

export default TaxonomyProvider
