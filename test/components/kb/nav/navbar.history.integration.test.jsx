import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import NavBar from '@/components/kb/nav/NavBar'
import panelMods from '@/components/kb/panels/modules'
import SelectedContext from '@/contexts/selected/SelectedContext'
import usePanelSelection from '@/contexts/selected/usePanelSelection'
import UserContext from '@/contexts/user/UserContext'
import { ROLES } from '@/lib/constants/roles.js'
import CONFIG from '@/lib/config'

const panelName = key => CONFIG.PANELS[key].PANEL.NAME

vi.mock('@/components/kb/nav/UserActions', () => ({
  default: () => <div data-testid='user-actions' />,
}))

vi.mock('@/components/kb/nav/PanelLink', () => ({
  default: ({ name, selectPanel }) => (
    <button aria-label={`panel-${name}`} onClick={() => selectPanel(name)} type='button'>
      {name}
    </button>
  ),
}))

const NavBarHarness = () => {
  const panels = usePanelSelection()

  return (
    <UserContext.Provider value={{ user: { role: ROLES.ADMIN } }}>
      <SelectedContext.Provider value={{ isLoading: false, panels }}>
        <NavBar selectPanel={name => panels.push(name)} />
        <div data-testid='current-panel'>{panels.current()}</div>
      </SelectedContext.Provider>
    </UserContext.Provider>
  )
}

describe('NavBar history integration', () => {
  it('updates selected panel when navigating previous and next', async () => {
    const user = userEvent.setup()

    render(<NavBarHarness />)

    expect(screen.getByTestId('current-panel')).toHaveTextContent(panelMods[0].name)

    await user.click(screen.getByRole('button', { name: `panel-${panelName('TEMPLATES')}` }))
    await user.click(screen.getByRole('button', { name: `panel-${panelName('HISTORY')}` }))

    expect(screen.getByTestId('current-panel')).toHaveTextContent(panelName('HISTORY'))

    await user.click(screen.getByRole('button', { name: 'previous' }))
    expect(screen.getByTestId('current-panel')).toHaveTextContent(panelName('TEMPLATES'))

    await user.click(screen.getByRole('button', { name: 'next' }))
    expect(screen.getByTestId('current-panel')).toHaveTextContent(panelName('HISTORY'))
  })
})
