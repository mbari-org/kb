import { makeStyles } from "@mui/styles"

const loginStyles = () => ({
  actions: {
    display: "block",
    marginTop: 20,
  },
  field: {
    margin: "10px 0",
  },
  content: {
    width: 400,
  },
  forgotPassword: {
    display: "block",
    color: "initial",
    textDecoration: "none",
    textAlign: "center",
  },
  alternativeActions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
})

const useStyles = makeStyles(loginStyles)

export default useStyles
