import { useTheme } from "@mui/material/styles"
import { Typography, Box } from "@mui/material"

const SubmitError = ({ errorText }) => {
  const theme = useTheme()

  return (
    <Box
      height={theme.spacing(2)}
      marginTop={theme.spacing(2)}
      textAlign="center"
    >
      {errorText && (
        <Typography
          color={theme.palette.error.main}
          fontSize={theme.typography.fontSize}
          fontWeight={theme.typography.fontWeightBold}
        >
          {errorText}
        </Typography>
      )}
    </Box>
  )
}

export default SubmitError
