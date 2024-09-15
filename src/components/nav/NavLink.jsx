import { Link } from "react-router-dom"

import { useTheme } from "@emotion/react"

import { useAuth } from "@/components/auth/AuthProvider"

const NavLink = ({ text, to }) => {
  const { updateUser } = useAuth()

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

  const navChange = event => {
    const panel = event.target.pathname.split("/").at(2)
    updateUser({ panel: panel })
  }

  return (
    <Link onClick={navChange} style={style} to={to}>
      {text}
    </Link>
  )
}

export default NavLink
