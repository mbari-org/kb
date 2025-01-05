import { alpha, createTheme, darken, lighten } from "@mui/material/styles"

const { palette } = createTheme()
const { augmentColor } = palette
const addColor = color => augmentColor({ color: { main: color } })

const main = "#0077be"
const light = alpha(main, 0.1)
const pale = alpha(main, 0.3)

const cancel = "#af0000"
const cleanDot = "#00ff00"
const conceptDetail = "#008800"
const paper = "#f0f0f0"
const navActive = "#ffffff"

const theme = createTheme({
  concept: {
    color: {
      clean: cleanDot,
      detail: conceptDetail,
      pending: cancel,
    },
    fontFamily: "Roboto, sans-serif",
    fontWeight: 600,
    infoFontSize: 32,
    updateFontSize: 24,
  },
  nav: {
    active: navActive,
    hover: navActive,
    inactive: darken(navActive, 0.15),
  },
  palette: {
    background: {
      default: paper,
      paper,
      paperDark: darken(paper, 0.1),
      paperLight: lighten(paper, 0.1),
    },
    cancel: addColor(cancel),
    light: addColor(light),
    pale: addColor(pale),
    main: addColor(main),
    primary: {
      cancel,
      light,
      main,
      pale,
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
