import { use, useTransition } from 'react'

import { AppBar, Box, Toolbar } from '@mui/material'

import LogoutLink from './LogoutLink'
import PanelLink from './PanelLink'
import PanelNavLinks from './PanelNavLinks'

import panels from '@/components/kb/panels/panels'

import AuthContext from '@/contexts/auth/AuthContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { isAdmin } from '@/lib/auth/role'

const NavBar = ({ selectPanel }) => {
  const { user } = use(AuthContext)
  const { panel } = use(SelectedContext)

  const activePanel = panel.current()

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
        <PanelNavLinks />
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
