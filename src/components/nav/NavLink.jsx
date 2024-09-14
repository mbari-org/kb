import { Link } from "react-router-dom"

import { useTheme } from "@emotion/react"

const NavLink = ({ text, to }) => {
  const theme = useTheme()

  const style = {
    textDecoration: "none",
    color: theme.palette.primary.contrastText,
    fontSize: theme.palette.fontSize,
    marginLeft: theme.spacing(2),
    "&:hover": {
      color: "yellow",
      borderBottom: "1px solid white",
    },
  }

  return (
    <Link style={style} to={to}>
      {text}
    </Link>
  )
}

export default NavLink
