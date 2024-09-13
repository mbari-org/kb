import { AppBar, Toolbar, Button } from "@mui/material"

import { useAuth } from "./auth/AuthProvider"

const NavBar = () => {
  const { logout } = useAuth()

  return (
    <AppBar position="static">
      <Toolbar>
        <div color="inherit">Concept</div>
        <div color="inherit">Tax</div>
        <div style={{ flexGrow: 1 }} />
        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
