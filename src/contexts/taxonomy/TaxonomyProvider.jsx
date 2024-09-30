import { use, useEffect, useState } from "react"

import TaxonomyContext from "./TaxonomyContext"

import AuthContext from "@/contexts/auth/AuthContext"
import ConfigContext from "@/contexts/config/ConfigContext"

import { lineage } from "@/model/concept"

const TaxonomyProvider = ({ children }) => {
  const { user } = use(AuthContext)
  const { config } = use(ConfigContext)

  const [taxonomy, setTaxonomy] = useState(null)

  const updateTaxonomy = update => {
    console.log("Apply taxonomy update:", update)
  }

  useEffect(() => {
    if (!!config && !!user) {
      const initialTaxonomy = { _config: config }
      lineage(initialTaxonomy, user.concept).then(({ taxonomy }) => {
        setTaxonomy(taxonomy)
      })
    }
  }, [config?.valid, user])

  if (!config || !user) {
    return null
  }

  return (
    <TaxonomyContext value={{ taxonomy, updateTaxonomy }}>
      {children}
    </TaxonomyContext>
  )
}

export default TaxonomyProvider
