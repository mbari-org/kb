import { AppBar, Toolbar, Button } from "@mui/material"

import { useAuth } from "@/components/auth/AuthProvider"

import KbLink from "./KbLink"

const NavBar = () => {
  const { logout } = useAuth()

  return (
    <AppBar position="static">
      <Toolbar>
        <KbLink text="Concepts" to="/kb/concepts" />
        <KbLink text="Templates" to="/kb/templates" />
        <KbLink text="References" to="/kb/references" />
        <KbLink text="Embargoes" to="/kb/embargoes" />
        <KbLink text="History" to="/kb/history" />
        <KbLink text="Notes" to="/kb/notes" />
        <KbLink text="Import/Export" to="/kb/import-export" />
        <KbLink text="About/Help" to="/kb/about-help" />
        <div style={{ flexGrow: 1 }} />
        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
