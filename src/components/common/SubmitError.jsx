import { useTheme } from "@mui/material/styles"

const SubmitError = ({ errorText }) => {
  const theme = useTheme()

  const styles = {
    color: theme.palette.error.main,
    fontSize: theme.typography.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    height: theme.spacing(2),
    marginTop: theme.spacing(2),
    textAlign: "center",
  }

  return <div style={styles}>{errorText}</div>
}

export default SubmitError
