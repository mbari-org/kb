import { AppBar, Toolbar, Button } from "@mui/material"

import { useAuth } from "@/components/auth/AuthProvider"

import NavLink from "./NavLink"

const NavBar = () => {
  const { logout } = useAuth()

  return (
    <AppBar position="static">
      <Toolbar>
        <NavLink text="Concepts" to="/kb/concepts" />
        <NavLink text="Templates" to="/kb/templates" />
        <NavLink text="References" to="/kb/references" />
        <NavLink text="Embargoes" to="/kb/embargoes" />
        <NavLink text="History" to="/kb/history" />
        <NavLink text="Notes" to="/kb/notes" />
        <NavLink text="Import/Export" to="/kb/import-export" />
        <NavLink text="About/Help" to="/kb/about-help" />
        <div style={{ flexGrow: 1 }} />
        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
