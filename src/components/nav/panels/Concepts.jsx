import { use } from "react"

import { Typography } from "@mui/material"

import ConfigContext from "@/contexts/config/ConfigContext"

const Concepts = () => {
  const { config } = use(ConfigContext)

  if (!config || config.conceptNamesFetch.error) {
    return null
  }

  const conceptNames = config.conceptNamesFetch.names

  console.log("Num fetched concept names: ", conceptNames.length)

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
