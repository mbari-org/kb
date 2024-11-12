import { TextField } from "@mui/material"
// import { useTheme } from "@mui/material/styles"

const ConceptAuthor = ({ concept, infoStyle }) => {
  return <TextField {...infoStyle} label="Author" value={concept?.author} />
}

export default ConceptAuthor
