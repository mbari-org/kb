import { useEffect, useState } from "react"

import { Typography } from "@mui/material"

import { conceptNames as oniConceptNames } from "@/lib/services/oni"

const Concepts = () => {
  const [conceptNames, setConceptNames] = useState([])

  useEffect(() => {
    const fetchConceptNames = async () => {
      try {
        const conceptNames = await oniConceptNames()
        setConceptNames(conceptNames)
      } catch (error) {
        console.error("Error fetching oni concept names:", error)
      }
    }
    fetchConceptNames()
  }, [])

  return (
    <>
      <Typography align="center" sx={{ mt: 3, mb: 1 }} variant="h3">
        Concepts
      </Typography>
      <Typography align="center" variant="h5" sx={{ mt: 3, mb: 1 }}>
        Herein lies great knowledge of all ocean creatures, far and wide.
      </Typography>
    </>
  )
}

export default Concepts
