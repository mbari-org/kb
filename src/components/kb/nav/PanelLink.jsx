import { use, useState } from "react"
import { Button } from "@mui/material"
import { useTheme } from "@emotion/react"

import AuthContext from "@/contexts/auth/AuthContext"

const PanelLink = ({ isActive, name, selectPanel }) => {
  const [isHovering, setIsHovering] = useState(false)

  const theme = useTheme()
  const style = () => {
    const activeColor = theme.palette.warning.light
    const hoverColor = theme.palette.primary.contrastText
    const inactiveColor = theme.palette.common.black

    const color = isActive
      ? activeColor
      : isHovering
      ? hoverColor
      : inactiveColor

    return {
      color: color,
      fontSize: theme.typography.fontSize,
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
