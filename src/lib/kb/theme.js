import { alpha, createTheme, darken, lighten } from '@mui/material/styles'

const { palette } = createTheme()
const { augmentColor } = palette
const addColor = color => augmentColor({ color: { main: color } })

const main = '#0077be'
const light = alpha(main, 0.1)
const pale = alpha(main, 0.3)

const cancel = '#af0000'
const clean = '#008800'
const conceptDetail = '#008800'
const navActive = '#ffffff'
const paper = '#f0f0f0'
const pendingIconClean = '#00dd00'
const pendingIconDirty = '#dd0000'
const remove = '#af0000'

const theme = createTheme({
  concept: {
    color: {
      clean,
      detail: conceptDetail,
      pending: cancel,
      pendingIcon: {
        clean: pendingIconClean,
        dirty: pendingIconDirty,
      },
      remove,
    },
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 600,
    infoFontSize: 32,
    updateFontSize: 24,
  },
  kb: {
    icon: {
      hover: { backgroundColor: `transparent !important`, transform: 'scale(1.25)' },
    },
  },
  nav: {
    active: navActive,
    fontSize: 12,
    hover: navActive,
    inactive: darken(navActive, 0.33),
  },
  palette: {
    background: {
      default: paper,
      paper,
      paperDark: darken(paper, 0.1),
      paperLight: lighten(paper, 0.1),
    },
    cancel: addColor(cancel),
    clean: addColor(clean),
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
      main: '#ff5722',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 16,
    fontWeight: 600,
  },
})

export default theme
