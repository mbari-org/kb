import { Typography } from "@mui/material"

const Concept = ({ concept }) => {
  return (
    <>
      <Typography align="center" sx={{ mt: 3, mb: 1 }} variant="h3">
        {concept?.name}
      </Typography>
      <div>Author: {concept.author}</div>
      <div>Aliases: {concept.alternateNames?.join(", ")}</div>
      <div>Rank: {concept.rank}</div>
      <div>Media: {concept.media}</div>
      <div>Link Realizations: {concept.linkRealizations}</div>
      <div>References: {concept.references}</div>
    </>
  )
}

export default Concept
