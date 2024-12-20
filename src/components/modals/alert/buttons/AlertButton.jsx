import { Button } from "@mui/material"
import { useTheme } from "@mui/material/styles"

const AlertButton = ({ choice, disabled, index, totalChoices, onChoice }) => {
  const theme = useTheme()

  return (
    <Button
      key={index}
      disabled={disabled}
      onClick={() => {
        onChoice(choice)
      }}
      sx={{
        color: theme.palette.primary.main,
        fontSize: "1.25rem",
        fontWeight: "bold",
        minWidth: "auto",
        padding: "8px 16px",
        position:
          index === 0 || index === totalChoices - 1 ? "absolute" : "static",
        left: index === 0 ? 0 : undefined,
        right: index === totalChoices - 1 ? 0 : undefined,
        ...(index > 0 &&
          index < totalChoices - 1 && {
            flexGrow: 1,
            textAlign: "center",
            mx: 0.5,
          }),
      }}
    >
      {choice}
    </Button>
  )
}

export default AlertButton
