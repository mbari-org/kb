import { makeStyles } from "@mui/styles"

const loginStyles = () => ({
  actions: {
    display: "block",
    marginTop: 20,
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
    marginTop: "5px",
    textAlign: "center",
    marginBottom: "10px",
  },
  errorField: {
    color: "red",
    fontSize: "14px",
    fontWeight: "bold",
  },
  field: {
    margin: "10px 0",
    minHeight: "40px",
  },
  forgotPassword: {
    display: "block",
    color: "initial",
    textDecoration: "none",
    textAlign: "center",
  },
})

const useStyles = makeStyles(loginStyles)

export default useStyles
