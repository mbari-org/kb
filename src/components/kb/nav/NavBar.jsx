import { AppBar, Toolbar } from "@mui/material"

import LogoutLink from "./LogoutLink"
import PanelLink from "./PanelLink"

import panels from "@/lib/panels"

const NavBar = ({ activePanel, selectPanel }) => {
  const names = panels.map(({ name }) => name)

  return (
    <AppBar position="static">
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
        <LogoutLink />
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
