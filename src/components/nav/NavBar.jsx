import { AppBar, Toolbar } from "@mui/material"

import PanelLink from "./PanelLink"
import LogoutLink from "./LogoutLink.jsx"

const NavBar = ({ activeTitle, titles, selectPanel }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        {titles.map(title => (
          <PanelLink
            id={`nav-link-${title}`}
            isActive={title === activeTitle}
            key={title}
            selectPanel={selectPanel}
            title={title}
          />
        ))}
        <div style={{ flexGrow: 1 }} />
        <LogoutLink />
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
