import { Typography } from "@mui/material"

const Concept = ({ concept }) => {
  return (
    <>
      <Typography align="center" sx={{ mt: 3, mb: 1 }} variant="h3">
        {concept?.name}
      </Typography>
    </>
  )
}

export default Concept
