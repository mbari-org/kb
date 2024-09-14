import { css } from "@emotion/react"
import { ThemeProvider } from "@emotion/react"

const theme = {
  colors: {
    primary: "#00A4FF",
    secondary: "#EE7E10",
    error: "#FA4A42",
    success: "#58BEB1",
    warning: "#ffae42",
    background: "#F1F3F6",
    text: {
      primary: "#000000",
      secondary: "#333333",
    },
  },
  palette: {
    action: {
      disabledBackground: "#F5F5F5",
      disabledOpacity: 0.38,
      focusOpacity: 0.12,
      hoverOpacity: 0.04,
      selectedOpacity: 0.08,
      disabled: "#000000",
    },
    background: {
      default: "#F1F3F6",
      paper: "#FFFFFF",
    },
    common: {
      black: "#000000",
      white: "#FFFFFF",
    },
    error: {
      main: "#FA4A42",
      light: "#FFC080",
      dark: "#E61E1E",
      contrastText: "#FFFFFF",
    },
    grey: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#EEEEEE",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: "#9E9E9E",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
      main: "#F1F3F6",
    },
    mode: "light",
    primary: {
      main: "#00A4FF",
      light: "#ADD8E6",
      dark: "#004C99",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#EE7E10",
      light: "#FFD180",
      dark: "#B26600",
      contrastText: "#000000",
    },
    success: {
      main: "#58BEB1",
      light: "#A5D6A7",
      dark: "#00695C",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#000000",
      secondary: "#333333",
      disabled: "rgba(0, 0, 0, 0.38)",
    },
    warning: {
      main: "#ffae42",
      light: "#FFE082",
      dark: "#FF9900",
      contrastText: "#000000",
    },
  },
  shadows: {
    0: "none",
    1: "0 3px 5px -1px rgba(0,0,0,.2)",
    2: "0 4px 8px 3px rgba(0,0,0,.14), 0 1px 14px 0 rgba(0,0,0,.12)",
    3: "0 10px 15px -3px rgba(0,0,0,.24), 0 4px 6px -4px rgba(0,0,0,.12)",
    4: "0 16px 24px 8px rgba(0,0,0,.3)",
    5: "0 24px 38px 3px rgba(0,0,0,.2)",
    6: "0 32px 50px 15px rgba(0,0,0,.21)",
    7: "0 48px 72px 22px rgba(0,0,0,.19)",
    8: "0 64px 96px 31px rgba(0,0,0,.15)",
    9: "0 80px 120px 51px rgba(0,0,0,.13)",
    10: "0 96px 144px 80px rgba(0,0,0,.11)",
    11: "0 112px 168px 112px rgba(0,0,0,.1)",
    12: "0 128px 192px 128px rgba(0,0,0,.08)",
    13: "0 160px 224px 160px rgba(0,0,0,.07)",
    14: "0 192px 288px 192px rgba(0,0,0,.05)",
    15: "0 240px 352px 240px rgba(0,0,0,.04)",
    16: "0 320px 480px 320px rgba(0,0,0,.03)",
    17: "0 480px 640px 480px rgba(0,0,0,.02)",
    18: "0 640px 960px 640px rgba(0,0,0,.01)",
    19: "0 800px 1200px 800px rgba(0,0,0,.005)",
    20: "0 960px 1440px 960px rgba(0,0,0,.003)",
  },
  shape: {
    borderRadius: 4,
  },
  spacing: 4,
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    },
    create: (props, options) => {
      return {
        duration: props.duration || (options && options.duration),
        easing: props.easing || (options && options.easing),
        delay: props.delay || (options && options.delay),
      }
    },
  },
  typography: {
    fontFamily: ["Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
}

// Create a CSS string for global styles
const globalStyles = css`
  html {
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.fontSize}px;
    line-height: 1.5;
    color: ${theme.palette.text.primary};
    background-color: ${theme.palette.background.default};
  }

  body {
    margin: 0;
    padding: 0;
  }

  * {
    box-sizing: border-box;
  }
`

export default theme

// Export global styles separately if needed
export { globalStyles }
