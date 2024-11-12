import { Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

const ConceptName = ({ concept }) => {
  const theme = useTheme()
  return (
    <Typography
      sx={{
        color: theme.concept.color,
        fontFamily: theme.concept.fontFamily,
        fontSize: theme.concept.fontSize,
        fontWeight: theme.concept.fontWeight,
      }}
    >
      {concept.name.toUpperCase()}
    </Typography>
  )
}

export default ConceptName
