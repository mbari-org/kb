import { use } from 'react'

import { AppBar, Box, Toolbar } from '@mui/material'

import NavHistoryLinks from '@/components/common/NavHistoryLinks'
import PanelLink from '@/components/kb/nav/PanelLink'
import UserActions from '@/components/kb/nav/UserActions'

import panelMods from '@/components/kb/panels/modules'

import UserContext from '@/contexts/user/UserContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

const NavBar = ({ selectPanel }) => {
  const { isAdmin } = use(UserContext)
  const { panels, isLoading } = use(SelectedContext)

  const activePanel = panels.current()

  const panelNames = isAdmin
    ? panelMods.map(({ name }) => name)
    : panelMods.map(({ name }) => name).filter(name => name !== 'Users')

  return (
    <AppBar
      position='static'
      sx={{
        height: '50px',
        backgroundColor: theme => theme.palette.primary.main,
      }}
    >
      <Toolbar>
        <Box sx={{ mb: 1.5 }}>
          {!isLoading && <NavHistoryLinks history={panels} />}
        </Box>
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
        <UserActions />
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
