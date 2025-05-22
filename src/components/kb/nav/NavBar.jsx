import { use } from 'react'

import { AppBar, Box, Toolbar } from '@mui/material'

import LogoutLink from './LogoutLink'
import PanelLink from './PanelLink'

import panels from '@/components/kb/panels/panels'

import AuthContext from '@/contexts/auth/AuthContext'

import { isAdmin } from '@/lib/auth/role'

const NavBar = ({ activePanel, selectPanel }) => {
  const { user } = use(AuthContext)

  const panelNames = isAdmin(user)
    ? panels.map(({ name }) => name)
    : panels.map(({ name }) => name).filter(name => name !== 'Users')

  return (
    <AppBar
      position='static'
      sx={{
        height: '50px',
        backgroundColor: theme => theme.palette.primary.dark,
      }}
    >
      <Toolbar>
        {panelNames.map(name => (
          <PanelLink
            id={`nav-link-${name}`}
            isActive={name === activePanel}
            key={name}
            name={name}
            selectPanel={selectPanel}
          />
        ))}
        <Box style={{ flexGrow: 1 }} />
        <LogoutLink sx={{ marginTop: '-10px' }} />
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
