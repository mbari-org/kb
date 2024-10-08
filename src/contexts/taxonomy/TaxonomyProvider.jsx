import { use, useEffect, useState } from "react"

import TaxonomyContext from "./TaxonomyContext"

import ConfigContext from "@/contexts/config/ConfigContext"

import { load, loadRoot } from "@/model/taxonomy"

const TaxonomyProvider = ({ children }) => {
  const { error: configError, config } = use(ConfigContext)
  if (!!configError) {
    console.log("CxTBD TaxonomyProvider config error:", error)
  }

  const [taxonomy, setTaxonomy] = useState(null)

  const updateTaxonomy = async conceptName => {
    const { error, taxonomy: updatedTaxonomy } = await load(
      taxonomy,
      conceptName
    )
    if (!!error) {
      console.error("Handle load concept error:", error)
    }
    setTaxonomy(updatedTaxonomy)
  }

  useEffect(() => {
    if (!!config) {
      loadRoot(config).then(({ error, taxonomy: initialTaxonomy }) => {
        if (!!error) {
          console.error("Handle taxonomy root error:", error)
        } else {
          setTaxonomy(initialTaxonomy)
        }
      })
    }
  }, [config])

  if (!taxonomy) {
    return null
  }

  return (
    <TaxonomyContext value={{ taxonomy, updateTaxonomy }}>
      {children}
    </TaxonomyContext>
  )
}

export default TaxonomyProvider
