import Box from "@mui/material/Box"

import { TreeItem2Label } from "@mui/x-tree-view/TreeItem2"

import ConceptText from "./ConceptText"

const ConceptLabel = ({ icon: Icon, expandable, children, ...other }) => {
  return (
    <TreeItem2Label
      {...other}
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {Icon && (
        <Box
          component={Icon}
          className="labelIcon"
          color="inherit"
          sx={{ mr: 1, fontSize: "1.2rem" }}
        />
      )}

      <ConceptText>{children}</ConceptText>
      {expandable && <DotIcon />}
    </TreeItem2Label>
  )
}

export default ConceptLabel
