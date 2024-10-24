import { useTheme } from "@emotion/react"
import { useState } from "react"

import { Button, darken } from "@mui/material"

const PanelLink = ({ isActive, name, selectPanel }) => {
  const [isHovering, setIsHovering] = useState(false)

  const theme = useTheme()
  const style = () => {
    const activeColor = theme.palette.warning.light
    const hoverColor = theme.palette.primary.contrastText
    const inactiveColor = darken(theme.palette.primary.contrastText, 0.15)

    const color = isActive
      ? activeColor
      : isHovering
      ? hoverColor
      : inactiveColor

    return {
      color: color,
      fontSize: theme.typography.fontSize,
      fontStyle: !isActive && isHovering ? "italic" : "",
      fontWeight: isActive ? "bold" : "",
      marginLeft: theme.spacing(2),
    }
  }

  return (
    <Button
      onClick={() => selectPanel(name)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={style()}
    >
      {name}
    </Button>
  )
}

export default PanelLink
