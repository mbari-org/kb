import { grey } from "@mui/material/colors"
import { alpha, createTheme, darken } from "@mui/material/styles"

import shadows from "./shadows"

const defaultTheme = createTheme({})

export const baseTheme = createTheme({
  analytics: {
    comparisons: {
      better: "#79cc79",
      same: "#f1c190",
      worse: "#ff9898",
    },
  },
  breakpoints: {
    keys: ["xs", "sm", "md", "lg", "xl"],
    values: {
      xs: 0,
      sm: 414,
      md: 600,
      lg: 960,
      xl: 1280,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontSize: "0.875rem",
          lineHeight: 1.43,
          letterSpacing: "0.01071em",
        },
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: "standard",
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: "standard",
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "standard",
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          lineHeight: "1.35rem",
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "hover",
      },
      styleOverrides: {
        root: {
          cursor: "pointer",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: defaultTheme.palette.action.selected,
          },
          "&.Mui-selected:hover": {
            backgroundColor: defaultTheme.palette.action.selected,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minWidth: 160,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#FFFFFFF8",
          fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
          fontSize: "0.875rem",
          fontWeight: 400,
          letterSpacing: "0.01071em",
          lineHeight: 1.43,
          color: "rgba(0, 0, 0, 0.87)",
          boxShadow: "0px 5px 10px 0px rgba(0,0,0,0.22)",
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#00A4FF",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#EE7E10",
    },
    error: {
      main: "#FA4A42",
      light: alpha("#FA4A42", 0.15),
    },
    warning: {
      main: "#ffae42",
    },
    success: {
      main: "#58BEB1",
      dark: darken("#58BEB1", 0.5),
    },
    grey: {
      main: grey[300],
      dark: grey[400],
    },
    background: {
      default: "#F1F3F6",
      darkened: "#e9ebef",
    },
    text: {
      secondary: `rgb(65, 67, 73)`,
      disabled: `rgb(85, 88, 99)`,
      hint: `rgb(82, 87, 96)`,
    },
    brand: {
      darkBlue: "#002956",
      lightCoral: "#EF6568",
      lightBlue: "#489AD4",
      lightGreen: "#5CBDAF",
      darkestGray: "#5C6565",
      mediumGray: "#7B8787",
      lightestGray: "#F5F6F6",
    },
    mode: "light",
    type: "light",
  },
  shadows,
  shape: {
    borderRadius: 3,
  },
  typography: {
    button: {
      borderRadius: 3,
    },
    h4: {
      fontWeight: 100,
      fontSize: "1.2rem",
      marginBottom: 24,
    },
  },
})

export default createTheme(baseTheme, {
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "outlined", color: "grey" },
          style: {
            color: baseTheme.palette.text.primary,
            borderColor: "rgba(0, 0, 0, 0.23)",
            "&.Mui-disabled": {
              border: `1px solid ${baseTheme.palette.action.disabledBackground}`,
            },
            "&:hover": {
              borderColor: "rgba(0, 0, 0, 0.23)",
              backgroundColor: alpha(
                baseTheme.palette.text.primary,
                baseTheme.palette.action.hoverOpacity
              ),
            },
          },
        },
        {
          props: { variant: "text", color: "grey" },
          style: {
            color: baseTheme.palette.text.primary,
            "&:hover": {
              backgroundColor: alpha(
                baseTheme.palette.text.primary,
                baseTheme.palette.action.hoverOpacity
              ),
            },
          },
        },
      ],
    },
  },
})
