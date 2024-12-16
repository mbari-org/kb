import { Box, Button } from "@mui/material"
import { useTheme } from "@mui/material/styles"

const AlertChoices = ({ choices, onChoice }) => {
  const theme = useTheme()

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
      {choices.map((choice, index) => (
        <Button
          key={index}
          onClick={() => {
            onChoice(choice)
          }}
          sx={{
            flex: 1,
            color: theme.palette.primary.main,
            fontSize: "1.25rem",
            fontWeight: "bold",
          }}
        >
          {choice}
        </Button>
      ))}
    </Box>
  )
}

export default AlertChoices
