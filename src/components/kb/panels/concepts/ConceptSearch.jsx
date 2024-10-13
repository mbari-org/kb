import { useEffect, useState } from "react"

import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"

const ConceptSearch = ({ concept, names, selectConcept }) => {
  const [value, setValue] = useState(null)

  useEffect(() => {
    setValue(concept?.name)
  }, [concept])

  return (
    <Autocomplete
      disablePortal
      onChange={(_event, newValue) => {
        selectConcept(newValue)
      }}
      options={names}
      renderInput={params => (
        <div style={{ marginRight: "7px" }}>
          <TextField {...params} label="Concept" />
        </div>
      )}
      value={value}
    />
  )
}

export default ConceptSearch
