import { alpha, createTheme, darken } from "@mui/material/styles"

const { palette } = createTheme()
const { augmentColor } = palette
const addColor = color => augmentColor({ color: { main: color } })

const baseMain = "#0077be"
const baseLight = alpha(baseMain, 0.1)
const basePale = alpha(baseMain, 0.3)
const darkRed = "#af0000"
const green = "#00ff00"
const midGreen = "#008800"
const red = "#ff0000"

const navActive = palette.common.white
const navHover = palette.primary.contrastText
const navInactive = darken(palette.primary.contrastText, 0.15)

const theme = createTheme({
  concept: {
    infoColor: midGreen,
    dot: green,
    pendingHistoryColor: darkRed,
    pendingHistoryDot: red,
    fontFamily: "Roboto, sans-serif",
    fontWeight: 600,
    infoFontSize: 32,
    updateFontSize: 24,
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
    cancel: addColor(darkRed),
    light: addColor(baseLight),
    pale: addColor(basePale),
    main: addColor(baseMain),
    primary: {
      light: baseLight,
      main: baseMain,
      pale: basePale,
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
