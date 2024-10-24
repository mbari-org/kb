// import { TreeItem2Root } from "@mui/x-tree-view"

// const ConceptItemRoot = ({ children }) => {
//   return <TreeItem2Root>{children}</TreeItem2Root>
// }
// export default ConceptItemRoot

import { styled } from "@mui/material"

const ConceptItemRoot = ({ theme }) => ({
  color: theme.palette.grey[400],
  position: "relative",
  ...theme.applyStyles("light", {
    color: theme.palette.grey[800],
  }),
})

export default styled("div")(ConceptItemRoot)
