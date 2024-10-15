import { useEffect, useState } from "react"

import { Divider, Stack, Typography } from "@mui/material"
import { alpha, useTheme } from "@mui/material/styles"

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
            sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.2) }}
          />
          <hr />
        </Stack>
      )}
      // sx={{
      //   backgroundColor: alpha((theme.vars || theme).palette.grey, 0.3),
      // }}
      value={value}
    />
  )
}

export default ConceptSearch
