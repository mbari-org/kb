import { useState } from "react"
import { NavLink } from "react-router-dom"

import { useTheme } from "@emotion/react"

import { useAuth } from "@/components/auth/AuthProvider"

const KbLink = ({ text, to }) => {
  const { updateUser } = useAuth()

  const [isHovering, setIsHovering] = useState(false)

  const theme = useTheme()
  const style = ({ isActive, isPending, isTransitioning }) => {
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
      // fontSize: theme.typography.fontSize,
      fontSize: "1.25rem",
      fontWeight: isActive ? "bold" : "",
      marginLeft: theme.spacing(2),
      textDecoration: "none",
      // viewTransitionName: isTransitioning ? "slide" : "",
    }
  }

  const onHover = over => setIsHovering(over)

  const onNav = event => {
    const panel = event.target.pathname.split("/").at(2)
    updateUser({ panel: panel })
  }

  return (
    <NavLink
      onClick={onNav}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={style}
      to={to}
    >
      {text}
    </NavLink>
  )
}

export default KbLink
