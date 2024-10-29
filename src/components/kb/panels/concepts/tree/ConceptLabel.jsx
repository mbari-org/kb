import { styled } from "@mui/material/styles"
import { lighten } from "@mui/system"

import ImageIcon from "@mui/icons-material/Image"
import DotIcon from "./DotIcon"

const StyledLabel = styled("div")(
  ({ theme, hasPendingHistory, isSelected }) => {
    const nonHoverStyle = { color: theme.palette.common.black, fontWeight: 500 }

    if (isSelected) {
      nonHoverStyle.color = theme.palette.grey[300]
      nonHoverStyle.fontWeight = 600
    }
    if (hasPendingHistory) {
      nonHoverStyle.color = isSelected
        ? lighten(theme.palette.error.main, 0.5)
        : theme.palette.error.main
    }

    return {
      ...nonHoverStyle,
      "&:hover": !isSelected && {
        color: theme.palette.primary.main,
        fontStyle: "italic",
      },
    }
  }
)

const ConceptLabel = ({
  children,
  hasPendingHistory,
  hasMedia,
  isSelected,
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
      <StyledLabel
        hasPendingHistory={hasPendingHistory}
        isSelected={isSelected}
      >
        {children}
      </StyledLabel>
      {hasMedia && <ImageIcon sx={{ ml: 0.5, maxWidth: "16px" }} />}
      {hasPendingHistory && <DotIcon />}
    </div>
  )
}

export default ConceptLabel
