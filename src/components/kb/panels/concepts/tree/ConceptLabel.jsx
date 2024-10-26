import { styled } from "@mui/material/styles"

import ImageIcon from "@mui/icons-material/Image"
import HistoryIcon from "./HistoryIcon"

const StyledLabel = styled("div")(({ theme, isSelected }) => ({
  fontWeight: isSelected ? 600 : 500,
  "&:hover": !isSelected && {
    color: theme.palette.primary.main,
    fontStyle: "italic",
  },
}))

const ConceptLabel = ({
  children,
  hasPendingHistory,
  hasMedia,
  isSelected,
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
      <StyledLabel isSelected={isSelected}>{children}</StyledLabel>
      {hasMedia && <ImageIcon sx={{ ml: 0.5, maxWidth: "16px" }} />}
      {hasPendingHistory && <HistoryIcon />}
    </div>
  )
}

export default ConceptLabel
