const styles = (theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    justifyContent: "center",
  },
  content: {
    alignSelf: "center",
    width: 355,
  },
  logo: {
    width: 246,
    marginBottom: 30,
  },
  errorBox: {
    padding: 0,
  },
  errorTitle: {
    color: "#FFF",
    padding: 20,
    backgroundColor: theme.palette.error.main,
  },
  errorMessage: {
    display: "block",
    padding: 20,
  },
})

export default styles
