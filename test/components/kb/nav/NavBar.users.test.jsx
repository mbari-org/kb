import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import NavBar from '@/components/kb/nav/NavBar'
import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'
import CONFIG from '@/lib/config'

vi.mock('@/config/panels/users/panel.json', async importOriginal => {
  const original = await importOriginal()
  return { default: { ...original.default, NAME: 'Configured users panel' } }
})

vi.mock('@/components/common/NavHistoryLinks', () => ({ default: () => null }))
vi.mock('@/components/kb/nav/UserActions', () => ({ default: () => null }))
vi.mock('@/components/kb/nav/PanelLink', () => ({
  default: ({ name, selectPanel }) => <button onClick={() => selectPanel(name)}>{name}</button>,
}))

const renderNavBar = isAdmin => {
  const selectPanel = vi.fn()
  render(
    <UserContext.Provider value={{ isAdmin }}>
      <SelectedContext.Provider value={{ isLoading: false, panels: { current: () => CONFIG.PANELS.CONCEPTS.PANEL.NAME } }}>
        <NavBar selectPanel={selectPanel} />
      </SelectedContext.Provider>
    </UserContext.Provider>
  )
  return selectPanel
}

describe('Users navigation', () => {
  it('hides the configured Users panel from non-admins', () => {
    renderNavBar(false)

    expect(screen.queryByRole('button', { name: CONFIG.PANELS.USERS.PANEL.NAME })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: CONFIG.PANELS.CONCEPTS.PANEL.NAME })).toBeInTheDocument()
  })

  it('lets admins select the configured Users panel', async () => {
    const user = userEvent.setup()
    const selectPanel = renderNavBar(true)

    await user.click(screen.getByRole('button', { name: CONFIG.PANELS.USERS.PANEL.NAME }))
    expect(selectPanel).toHaveBeenCalledWith(CONFIG.PANELS.USERS.PANEL.NAME)
  })
})
