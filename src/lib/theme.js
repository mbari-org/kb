import { grey } from '@mui/material/colors'
import { alpha, createTheme } from '@mui/material/styles'

import color from '@/config/color.json'

const { palette } = createTheme()
const { augmentColor } = palette
const addColor = color => augmentColor({ color: { main: color } })
const paper = color.COLOR.BACKGROUND

const buttonColors = {
  approve: addColor(color.COLOR.BUTTON.APPROVE),
  cancel: addColor(color.COLOR.BUTTON.CANCEL),
  edit: addColor(color.COLOR.BUTTON.EDIT),
  export: addColor(color.COLOR.BUTTON.EXPORT),
  main: addColor(color.COLOR.BUTTON.MAIN),
  pending: addColor(color.COLOR.BUTTON.PENDING),
  reject: addColor(color.COLOR.BUTTON.REJECT),
}

const buttonColorStyle = ({ main, dark, contrastText }) => ({
  '@media (hover: hover)': {
    '&:hover': {
      '--variant-containedBg': dark,
      '--variant-outlinedBg': alpha(main, palette.action.hoverOpacity),
      '--variant-outlinedBorder': main,
      '--variant-textBg': alpha(main, palette.action.hoverOpacity),
    },
  },
  '--variant-containedBg': main,
  '--variant-containedColor': contrastText === palette.common.white ? paper : contrastText,
  '--variant-outlinedBorder': alpha(main, 0.5),
  '--variant-outlinedColor': main,
  '--variant-textColor': main,
})

const main = color.COLOR.MAIN
const light = alpha(main, 0.1)
const pale = alpha(main, 0.3)

const add = color.COLOR.ACTION.ADD
const edit = color.COLOR.ACTION.EDIT

const approve = add
const cancel = color.COLOR.CANCEL
const clean = color.COLOR.CLEAN
const conceptDetail = color.COLOR.CONCEPT_DETAIL
const reject = cancel
const remove = color.COLOR.ACTION.DELETE
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
      remove,
    },
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 600,
    infoFontSize: 32,
    updateFontSize: 24,
  },
  kb: {
    icon: {
      colors: color.COLOR.ACTION,
      hover: {
        backgroundColor: 'background.paper',
        color: 'primary.main',
        transform: 'scale(1.25)',
      },
    },
  },
  selector: {
    active: selectorActive,
    fontSize: 12,
    hover: selectorActive,
    inactive: selectorInactive,
  },
  toggleButton: {
    backgroundColor: grey[600],
    color: selectorInactive,
    '&.Mui-selected': {
      backgroundColor: main,
      color: selectorActive,
    },
    '&:hover': {
      backgroundColor: grey[800],
      color: selectorActive,
    },
    '&.Mui-selected:hover': {
      backgroundColor: main,
      color: selectorActive,
    },
    '&:not(:last-child)': {
      borderRight: '3px solid rgba(255, 255, 255, 0.5)',
    },
  },
  palette: {
    add: addColor(add),
    background: {
      default: paper,
      paper,
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
    MuiButton: {
      styleOverrides: {
        root: {
          variants: Object.entries({ ...buttonColors, primary: buttonColors.main }).map(([name, value]) => ({
            props: { color: name },
            style: buttonColorStyle(value),
          })),
        },
      },
    },
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
            backgroundColor: 'transparent !important',
            paddingTop: '1px',
            paddingBottom: '0px',
            minHeight: 'auto',
            // Remove default hover/selection backgrounds
            '&:hover': {
              backgroundColor: 'transparent !important',
            },
            '&.Mui-selected': {
              backgroundColor: 'transparent !important',
            },
            '&.Mui-selected:hover': {
              backgroundColor: 'transparent !important',
            },
            '&.Mui-focused': {
              backgroundColor: 'transparent !important',
            },
          },
          '& .MuiTreeItem-label': {
            backgroundColor: 'transparent !important',
            padding: '0px',
          },
        },
      },
    },
  },
})

export default theme
