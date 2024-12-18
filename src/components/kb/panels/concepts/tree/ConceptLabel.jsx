import { styled, useTheme } from "@mui/material/styles"

import ImageIcon from "@mui/icons-material/Image"
import DotIcon from "./DotIcon"

const StyledLabel = styled("div")(
  ({ theme, hasPendingHistory, isSelected }) => {
    const nonHoverStyle = { color: theme.palette.common.black, fontWeight: 500 }

    if (isSelected) {
      nonHoverStyle.color = theme.palette.common.white
      nonHoverStyle.fontWeight = 600
    }
    if (hasPendingHistory) {
      nonHoverStyle.color = isSelected
        ? theme.palette.common.white
        : theme.palette.error.main
    }

    return {
      ...nonHoverStyle,
      "&:hover": !isSelected && {
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
  const { concept: conceptTheme } = useTheme()
  const dotColor = hasPendingHistory
    ? conceptTheme.pendingHistoryDot
    : conceptTheme.dot

  return (
    <div style={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
      <StyledLabel
        hasPendingHistory={hasPendingHistory}
        isSelected={isSelected}
      >
        {children}
      </StyledLabel>
      {hasMedia && <ImageIcon sx={{ ml: 0.5, maxWidth: "16px" }} />}
      {isSelected && <DotIcon bgcolor={dotColor} />}
    </div>
  )
}

export default ConceptLabel
