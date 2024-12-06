import { use, useState } from "react"

import { Box } from "@mui/material"

import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify"
import GridViewIcon from "@mui/icons-material/GridView"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"

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
        <ConceptViewToggleButton
          Icon={FormatAlignJustifyIcon}
          value="standard"
        />
        <ConceptViewToggleButton Icon={GridViewIcon} value="thumbnail" />
      </ToggleButtonGroup>
    </Box>
  )
}

export default ConceptViewToggle
