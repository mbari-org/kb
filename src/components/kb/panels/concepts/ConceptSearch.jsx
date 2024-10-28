import { use, useEffect, useState } from "react"

import { Stack, Typography } from "@mui/material"
import { alpha, useTheme } from "@mui/material/styles"

import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"

import SelectedContext from "@/contexts/selected/SelectedContext"

const ConceptSearch = ({ concept, taxonomy }) => {
  const theme = useTheme()
  const { updateSelectedConcept: selectConcept } = use(SelectedContext)

  const [conceptName, setConceptName] = useState(null)

  useEffect(() => {
    setConceptName(concept.name)
  }, [concept])

  return (
    <Autocomplete
      // disablePortal
      onChange={(_event, newValue) => {
        newValue && selectConcept(newValue)
      }}
      options={taxonomy.names}
      renderInput={params => (
        <Stack>
          <Typography
            sx={{
              fontSize: theme => theme.typography.fontSize * 1.4,
              fontWeight: "bold",
            }}
          >
            Concept
          </Typography>
          <TextField
            {...params}
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
            }}
          />
          <hr />
        </Stack>
      )}
      size="small"
      slotProps={{
        paper: {
          sx: {
            "& .MuiAutocomplete-listbox": {
              "& .MuiAutocomplete-option": {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            },
          },
        },
      }}
      value={conceptName}
    />
  )
}

export default ConceptSearch
