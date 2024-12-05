import { alpha, createTheme, darken } from "@mui/material/styles"

const { palette } = createTheme()
const { augmentColor } = palette
const addColor = color => augmentColor({ color: { main: color } })

const baseMain = "#0077be"
const lightColor = alpha(baseMain, 0.1)
const paleColor = alpha(baseMain, 0.3)

const navActive = palette.common.white
const navHover = palette.primary.contrastText
const navInactive = darken(palette.primary.contrastText, 0.15)

const theme = createTheme({
  concept: {
    color: "#008800",
    fontFamily: "Roboto, sans-serif",
    fontSize: 32,
    fontWeight: 600,
  },
  nav: {
    active: navActive,
    hover: navHover,
    inactive: navInactive,
  },
  palette: {
    background: {
      default: "#f0f0f0",
      paper: "#f0f0f0",
    },
    cancel: addColor("#8b0000"),
    light: addColor(lightColor),
    pale: addColor(paleColor),
    main: addColor(baseMain),
    primary: {
      light: lightColor,
      main: baseMain,
      pale: paleColor,
    },
    secondary: {
      main: "#ff5722",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    fontSize: 16,
    fontWeight: 600,
  },
})

export default theme
