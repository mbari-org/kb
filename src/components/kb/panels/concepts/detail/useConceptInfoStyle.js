import { useTheme } from "@mui/material/styles"
import { useCallback } from "react"

const useConceptInfoStyle = editing => {
  const theme = useTheme()

  return useCallback(() => {
    return {
      disabled: !editing,
      fullWidth: true,
      size: "small",
      variant: editing ? "filled" : "standard",
      sx: {
        "& .MuiInputBase-input": {
          backgroundColor: theme.palette.primary.light,
          color: theme => theme.palette.common.black,
          // WebkitTextFillColor: theme.palette.common.black,
        },
        "& .MuiInputBase-input.Mui-disabled": {
          backgroundColor: "transparent",
          // color: theme.palette.common.black,
          WebkitTextFillColor: theme.palette.common.black,
        },
      },
    }
  }, [editing, theme])
}

export default useConceptInfoStyle
