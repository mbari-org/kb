import { describe, expect, it, vi } from 'vitest'
import { render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'

import useUserColumns from '@/components/kb/panels/users/table/data/useUserColumns'
import UserContext from '@/contexts/user/UserContext'
import theme from '@/lib/theme'

vi.mock('react-icons/ai', () => ({
  AiOutlineLock: () => <span>locked icon</span>,
  AiOutlineUnlock: () => <span>unlocked icon</span>,
}))

vi.mock('react-icons/ci', () => ({
  CiEdit: () => <span>edit icon</span>,
}))

describe('user lock icons', () => {
  it.each([
    [false, 'unlocked icon', 'DELETE'],
    [true, 'locked icon', 'ADD'],
  ])('uses the configured hover color for locked=%s', async (locked, icon, action) => {
    const user = userEvent.setup()
    const lockUserModal = vi.fn()
    const row = { username: 'test', locked }
    const { result } = renderHook(() => useUserColumns({ editUserModal: vi.fn(), lockUserModal }))
    const actions = result.current.find(column => column.field === 'actions')

    render(
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={{ isReadOnly: false }}>
          {actions.renderCell({ row })}
        </UserContext.Provider>
      </ThemeProvider>
    )

    const button = screen.getByText(icon).closest('button')
    const hoverColors = Array.from(document.styleSheets).flatMap(sheet =>
      Array.from(sheet.cssRules)
        .filter(rule => rule.selectorText?.endsWith(':hover') && button.matches(rule.selectorText.replace(':hover', '')))
        .map(rule => rule.style.color)
    )
    const expectedColor = document.createElement('span')
    expectedColor.style.color = theme.kb.icon.colors[action]

    expect(button).toHaveStyle({ color: theme.kb.icon.colors.NONE })
    expect(hoverColors).toContain(expectedColor.style.color)
    await user.click(button)
    expect(lockUserModal).toHaveBeenCalledWith(row)
  })

  describe('user edit icon', () => {
    it('hides the edit action for locked users without removing its layout space', async () => {
      const user = userEvent.setup()
      const editUserModal = vi.fn()
      const unlocked = { username: 'test', locked: false }
      const locked = { ...unlocked, locked: true }
      const { result } = renderHook(() => useUserColumns({ editUserModal, lockUserModal: vi.fn() }))
      const actions = result.current.find(column => column.field === 'actions')
      const cell = row => (
        <ThemeProvider theme={theme}>
          <UserContext.Provider value={{ isReadOnly: false }}>
            {actions.renderCell({ row })}
          </UserContext.Provider>
        </ThemeProvider>
      )
      const { rerender } = render(cell(unlocked))
      const editButton = screen.getByText('edit icon').closest('button')

      expect(editButton).toBeVisible()
      await user.click(editButton)
      expect(editUserModal).toHaveBeenCalledWith(unlocked)

      rerender(cell(locked))
      const hiddenEditButton = screen.getByText('edit icon').closest('button')
      expect(hiddenEditButton).toBe(editButton)
      expect(hiddenEditButton).not.toBeVisible()
      expect(hiddenEditButton.parentElement.parentElement).toHaveStyle({ display: 'inline-flex', visibility: 'hidden' })
      expect(screen.getAllByRole('button')).toHaveLength(1)
    })
  })
})
