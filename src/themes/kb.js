import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, sans-serif",
    fontSize: 16,
    fontWeight: 600,
  },
  palette: {
    concept: {
      color: "#008800",
      fontFamily: "Roboto, sans-serif",
      fontSize: 32,
      fontWeight: 600,
    },
    primary: {
      main: "#0077be",
    },
    secondary: {
      main: "#ff5722",
    },
  },
})

export default theme
