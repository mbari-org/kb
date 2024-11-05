import { useState } from "react"

import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify"
import GridViewIcon from "@mui/icons-material/GridView"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"

import ConceptViewToggleButton from "./ConceptViewToggleButton"

const ConceptViewToggle = () => {
  const [conceptView, setConceptView] = useState("standard")

  const handleViewSelection = (_event, newConceptView) => {
    !!newConceptView && setConceptView(newConceptView)
  }

  return (
    <ToggleButtonGroup
      value={conceptView}
      exclusive
      onChange={handleViewSelection}
      aria-label="text alignment"
    >
      <ConceptViewToggleButton Icon={FormatAlignJustifyIcon} value="standard" />
      <ConceptViewToggleButton Icon={GridViewIcon} value="thumbnail" />
    </ToggleButtonGroup>
  )
}

export default ConceptViewToggle
