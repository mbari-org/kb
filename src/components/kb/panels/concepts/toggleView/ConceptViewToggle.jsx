import { use, useState } from "react"

import { Box } from "@mui/material"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"

import { FaList } from "react-icons/fa6"
import { SlGrid } from "react-icons/sl"

import ConceptViewToggleButton from "./ConceptViewToggleButton"

import ConceptContext from "@/contexts/concept/ConceptContext"

const ConceptViewToggle = ({ sx }) => {
  const { editing } = use(ConceptContext)

  const [conceptView, setConceptView] = useState("standard")

  const handleViewSelection = (_event, newConceptView) => {
    !!newConceptView && setConceptView(newConceptView)
  }

  return (
    <Box sx={sx}>
      <ToggleButtonGroup
        aria-label="text alignment"
        disabled={editing}
        exclusive
        onChange={handleViewSelection}
        value={conceptView}
      >
        <ConceptViewToggleButton Icon={FaList} value="standard" />
        <ConceptViewToggleButton Icon={SlGrid} value="thumbnail" />
      </ToggleButtonGroup>
    </Box>
  )
}

export default ConceptViewToggle
