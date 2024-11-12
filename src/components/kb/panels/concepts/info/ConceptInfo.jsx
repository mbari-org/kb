import { Stack, TextField, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import ConceptRank from "./ConceptRank"

const ConceptInfo = ({ concept, editable }) => {
  const theme = useTheme()

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{ flex: "1", ml: 1, mr: 1, textAlign: "left" }}
    >
      <Typography
        sx={{
          color: theme.palette.concept.color,
          fontFamily: theme.palette.concept.fontFamily,
          fontSize: theme.palette.concept.fontSize,
          fontWeight: theme.palette.concept.fontWeight,
        }}
      >
        {concept.name.toUpperCase()}
      </Typography>
      <TextField
        disabled={!editable}
        fullWidth
        label="Author"
        size="small"
        value={concept.author}
        variant="filled"
      />
      <Stack direction="row" spacing={2}>
        <ConceptRank concept={concept} editable={editable} />
        <TextField
          disabled={!editable}
          fullWidth
          label="Level"
          size="small"
          value={undefined}
          variant="filled"
        />
      </Stack>
    </Stack>
  )
}

export default ConceptInfo
