import { makeStyles } from "@mui/styles"

const loginStyles = theme => ({
  actions: {
    display: "block",
    marginTop: theme.spacing(2),
  },
  alternativeActions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    width: 400,
  },
  errorContainer: {
    marginTop: theme.spacing(1),
    textAlign: "center",
    marginBottom: theme.spacing(2),
  },
  errorField: {
    color: theme.palette.error.main,
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightBold,
  },
  field: {
    margin: theme.spacing(1),
    minHeight: theme.spacing(4),
  },
  forgotPassword: {
    display: "block",
    color: theme.palette.text.primary,
    marginTop: theme.spacing(2),
    textDecoration: "none",
    textAlign: "center",
  },
})

export default makeStyles(loginStyles)
