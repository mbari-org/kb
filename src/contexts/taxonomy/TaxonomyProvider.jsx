import { use, useEffect, useState } from "react"

import TaxonomyContext from "./TaxonomyContext"

import AuthContext from "@/contexts/auth/AuthContext"
import ConfigContext from "@/contexts/config/ConfigContext"

import { lineage, load } from "@/model/concept"

const TaxonomyProvider = ({ children }) => {
  const { user } = use(AuthContext)
  const { config } = use(ConfigContext)

  console.log("config:", config)
  console.log("user:", user)

  const [taxonomy, setTaxonomy] = useState(null)

  const updateTaxonomy = update => {
    console.log("Apply taxonomy update:", update)
  }

  useEffect(() => {
    if (!!config && !!user) {
      const emptyTaxonomy = { _config: config }
      load(emptyTaxonomy, user.concept).then(({ taxonomy }) => {
        lineage(taxonomy, user.concept).then(({ taxonomy }) => {
          setTaxonomy(taxonomy)
        })
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
