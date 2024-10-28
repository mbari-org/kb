import { Typography } from "@mui/material"

const Concept = ({ concept }) => {
  return (
    <>
      <Typography align="center" sx={{ mt: 3, mb: 1 }} variant="h3">
        {concept.name}
      </Typography>
      <div>Author: {concept.author}</div>
      <div>Aliases: {concept.alternateNames?.join(", ")}</div>
      <div>Rank: {concept.rank}</div>
      <div>Media: {0 < concept.media.length ? "YES" : "NO"}</div>
      <div>
        Link Realizations: {0 < concept.linkRealizations.length ? "YES" : "NO"}
      </div>
      <div>References: {0 < concept.references.length ? "YES" : "NO"}</div>
    </>
  )
}

export default Concept
