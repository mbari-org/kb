import { useEffect, useState } from "react"

import { Stack, Typography } from "@mui/material"
import { alpha, useTheme } from "@mui/material/styles"

import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"

const ConceptSearch = ({ concept, names, selectConcept }) => {
  const theme = useTheme()

  const [value, setValue] = useState(null)

  useEffect(() => {
    setValue(concept.name)
  }, [concept])

  return (
    <Autocomplete
      // disablePortal
      onChange={(_event, newValue) => {
        newValue && selectConcept(newValue)
      }}
      options={names}
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
      value={value}
    />
  )
}

export default ConceptSearch
