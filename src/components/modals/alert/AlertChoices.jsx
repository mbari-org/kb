import { Box, Button } from "@mui/material"
import { useTheme } from "@mui/material/styles"

const AlertChoices = ({ choices, onChoice }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mt: 2,
        px: 0,
        boxSizing: "border-box",
        position: "relative",
        height: "100%", // Ensure the container takes full height
      }}
    >
      {choices.map((choice, index) => (
        <Button
          key={index}
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
              index === 0 || index === choices.length - 1
                ? "absolute"
                : "static",
            left: index === 0 ? 0 : undefined,
            right: index === choices.length - 1 ? 0 : undefined,
            ...(index > 0 &&
              index < choices.length - 1 && {
                flexGrow: 1,
                textAlign: "center",
                mx: 0.5, // Small margin between middle buttons
              }),
          }}
        >
          {choice}
        </Button>
      ))}
    </Box>
  )
}

export default AlertChoices
