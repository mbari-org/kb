import { Button } from "@mui/material"

const Action = ({ color, disabled, index, label, onAction, totalActions }) => {
  return (
    <Button
      key={index}
      color={color || "main"}
      disabled={disabled && disabled[index]}
      onClick={() => onAction(label)}
      sx={{
        marginLeft: totalActions === 1 ? "auto" : "inherit",
        minWidth: "auto",
        paddingX: 2,
        textAlign: index > 0 && index < totalActions - 1 ? "center" : "inherit",
        whiteSpace: "nowrap",
      }}
      variant="contained"
    >
      {label}
    </Button>
  )
}

export default Action
