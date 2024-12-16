import { Box, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

const AlertConceptNameMessage = ({ from, to }) => {
  const theme = useTheme()

  const text = "Are you sure you want to update Concept name"

  return (
    <>
      <Typography
        id="modal-message"
        variant="h6"
        component="h3"
        sx={{ color: theme.palette.common.black, mt: 2 }}
      >
        {text}
      </Typography>

      <Box display="flex" flexDirection="column" sx={{ ml: 3 }}>
        <Box display="flex" alignItems="center">
          <Typography minWidth={60}>From:</Typography>
          <Typography
            component="h3"
            fontWeight="bold"
            sx={{ color: theme.palette.common.black, ml: 1 }}
            variant="h6"
          >
            {from}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Typography minWidth={60}>To:</Typography>
          <Typography
            component="h3"
            fontWeight="bold"
            sx={{ color: theme.palette.common.black, ml: 1 }}
            variant="h6"
          >
            {to}
          </Typography>
        </Box>
      </Box>

      <div>
        <p>
          {`Updating the name of concept will affect CxTBD link realizations.`}
        </p>
        <p>{`Proceed with caution.`}</p>
      </div>
    </>
  )
}

export default AlertConceptNameMessage
