import { useTheme } from "@mui/material/styles"
import { useCallback } from "react"

const useConceptInfoStyle = editable => {
  const theme = useTheme()

  return useCallback(() => {
    return {
      disabled: !editable,
      fullWidth: true,
      size: "small",
      variant: editable ? "filled" : "standard",
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
  }, [editable, theme])
}

export default useConceptInfoStyle
