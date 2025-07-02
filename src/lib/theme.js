import { grey } from '@mui/material/colors'
import { alpha, createTheme, darken, lighten } from '@mui/material/styles'

const { palette } = createTheme()
const { augmentColor } = palette
const addColor = color => augmentColor({ color: { main: color } })

const main = '#005385'
const light = alpha(main, 0.1)
const pale = alpha(main, 0.3)

const add = '#008800'
const edit = '#ee8311'

const approve = add
const cancel = '#af0000'
const clean = '#008800'
const conceptDetail = '#008800'
const paper = '#f0f0f0'
const pendingIconClean = '#00dd00'
const pendingIconDirty = '#dd0000'
const reject = cancel
const remove = cancel
const selectorActive = grey[100]
const selectorInactive = grey[400]

const theme = createTheme({
  concept: {
    color: {
      add,
      clean,
      detail: conceptDetail,
      edit,
      pending: edit,
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
  selector: {
    active: selectorActive,
    fontSize: 12,
    hover: selectorActive,
    inactive: selectorInactive,
  },
  palette: {
    add: addColor(add),
    background: {
      default: paper,
      paper,
      paperDark: darken(paper, 0.1),
      paperLight: lighten(paper, 0.1),
    },
    approve: addColor(approve),
    cancel: addColor(cancel),
    clean: addColor(clean),
    edit: addColor(edit),
    light: addColor(light),
    pale: addColor(pale),
    main: addColor(main),
    remove: addColor(remove),
    reject: addColor(reject),
    primary: {
      add,
      cancel,
      clean,
      edit,
      light,
      main,
      pale,
      remove,
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
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-formControl': {
            color: '#888888',
          },
        },
      },
    },
    MuiTreeView: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiTreeItem: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          '& .MuiTreeItem-content': {
            backgroundColor: 'transparent',
            paddingTop: '1px',
            paddingBottom: '0px',
            minHeight: 'auto',
          },
          '& .MuiTreeItem-label': { padding: '0px' },
        },
      },
    },
  },
})

export default theme
