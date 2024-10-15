import { useEffect, useState } from "react"

import { useTheme } from "@mui/material/styles"

import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"

const ConceptSearch = ({ concept, names, selectConcept }) => {
  const theme = useTheme()

  const [value, setValue] = useState(null)

  useEffect(() => {
    setValue(concept.name)
  }, [concept])

  return (
    <Autocomplete
      disablePortal
      onChange={(_event, newValue) => {
        newValue && selectConcept(newValue)
      }}
      options={names}
      renderInput={params => <TextField {...params} label="Concept" />}
      sx={{ backgroundColor: theme.palette.grey[200] }}
      value={value}
    />
  )
}

export default ConceptSearch
