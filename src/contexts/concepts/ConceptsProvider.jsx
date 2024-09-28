import { use, useEffect, useState } from "react"

import AuthContext from "@/contexts/auth/AuthContext"
import ConceptsContext from "@/contexts/concepts/ConceptsContext"
import ConfigContext from "@/contexts/config/ConfigContext"

const ConceptsProvider = ({ children }) => {
  const { user } = use(AuthContext)
  const { config } = use(ConfigContext)

  const [concepts, setConcepts] = useState(null)

  const fillTaxonomy = async conceptName => {}

  const conceptChildren = async conceptName => {}

  const conceptParent = async conceptName => {}

  useEffect(() => {
    if (user?.concept) {
    }
  }, [user])

  if (!user || !config) {
    return null
  }

  return <ConceptsContext value={{ concepts }}>{children}</ConceptsContext>
}

export default ConceptsProvider
