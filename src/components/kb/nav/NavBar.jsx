import { AppBar, Toolbar } from "@mui/material"

import LogoutLink from "./LogoutLink"
import PanelLink from "./PanelLink"

import panels from "@/lib/kb/panels"

const NavBar = ({ activePanel, selectPanel }) => {
  const names = panels.map(({ name }) => name)

  return (
    <AppBar
      position="static"
      sx={{
        height: "50px",
        backgroundColor: theme => theme.palette.primary.dark,
      }}
    >
      <Toolbar>
        {names.map(name => (
          <PanelLink
            id={`nav-link-${name}`}
            isActive={name === activePanel}
            key={name}
            selectPanel={selectPanel}
            name={name}
          />
        ))}
        <div style={{ flexGrow: 1 }} />
        <LogoutLink sx={{ marginTop: "-10px" }} />
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
