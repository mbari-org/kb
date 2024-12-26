import { Button } from "@mui/material"

const AlertButton = ({
  choice,
  color,
  disabled,
  index,
  totalChoices,
  onChoice,
}) => {
  return (
    <Button
      key={index}
      color={color || "main"}
      disabled={disabled}
      onClick={() => onChoice(choice)}
      sx={{
        mx: index > 0 && index < totalChoices - 1 ? 0.5 : 0,
        minWidth: "auto",
        paddingX: 2,
        textAlign: index > 0 && index < totalChoices - 1 ? "center" : "inherit",
        whiteSpace: "nowrap",
      }}
      variant="contained"
    >
      {choice}
    </Button>
  )
}

export default AlertButton
