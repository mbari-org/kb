import { use, useEffect, useState } from "react"

import { Typography } from "@mui/material"

import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"
import UserContext from "@/contexts/user/UserContext"

const Concept = () => {
  const { taxonomy, loadConcept } = use(TaxonomyContext)
  const { user } = use(UserContext)

  const [concept, setConcept] = useState(null)

  useEffect(() => {
    if (!!taxonomy) {
      loadConcept(user.concept).then(({ error, taxonomy }) => {
        setConcept(taxonomy[user.concept])
      })
    }
  }, [taxonomy, user])

  if (!concept) {
    return null
  }

  return (
    <>
      <Typography align="center" sx={{ mt: 3, mb: 1 }} variant="h3">
        {concept.name}
      </Typography>
    </>
  )
}

export default Concept
