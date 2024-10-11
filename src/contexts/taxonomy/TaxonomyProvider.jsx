import { use, useEffect, useState } from "react"

import TaxonomyContext from "./TaxonomyContext"

import ConfigContext from "@/contexts/config/ConfigContext"

import { load, loadRoot } from "@/model/taxonomy"

import selectedStore from "@/lib/store/selected"
import conceptUrl from "@/lib/services/oni/concept/conceptUrl"

const TaxonomyProvider = ({ children }) => {
  const { error: configError, config } = use(ConfigContext)
  if (configError) {
    console.log("CxTBD TaxonomyProvider config error:", error)
  }

  const [taxonomy, setTaxonomy] = useState(null)

  const updateTaxonomy = async conceptName => {
    const { error, taxonomy: updatedTaxonomy } = await load(
      taxonomy,
      conceptName
    )
    if (error) {
      console.error("Handle load concept error:", error)
    }
    setTaxonomy(updatedTaxonomy)
  }

  useEffect(() => {
    if (config) {
      loadRoot(config).then(({ error: rootError, taxonomy: rootTaxonomy }) => {
        if (rootError) {
          console.error("Handle taxonomy root error:", rootError)
          return
        }
        const initialSelected = selectedStore.get()
        if (initialSelected?.concept) {
          load(rootTaxonomy, initialSelected.concept).then(
            ({
              error: selectedConceptError,
              taxonomy: taxonomyWithConcept,
            }) => {
              if (selectedConceptError) {
                console.error(
                  "Handle taxonomy load selected concept error:",
                  selectedConceptError
                )
                return
              }
              setTaxonomy(taxonomyWithConcept)
            }
          )
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
