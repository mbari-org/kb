import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { describe, expect, it, vi } from 'vitest'

import PendingButtons from '@/components/kb/panels/concepts/concept/change/pending/PendingButtons'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import UserContext from '@/contexts/user/UserContext'
import { PENDING } from '@/lib/constants/pending.js'
import kbTheme from '@/lib/theme'

describe('PendingButtons', () => {
  it('updates visibility when admin access changes and preserves the approval action', async () => {
    const setPendingConfirm = vi.fn()
    const renderButtons = isAdmin => (
      <ThemeProvider theme={kbTheme}>
        <UserContext.Provider value={{ isAdmin }}>
          <ConceptContext.Provider value={{ setPendingConfirm }}>
            <PendingButtons item={{ id: 'item-1' }} />
          </ConceptContext.Provider>
        </UserContext.Provider>
      </ThemeProvider>
    )

    const { rerender } = render(renderButtons(false))
    expect(screen.queryAllByRole('button')).toHaveLength(0)

    rerender(renderButtons(true))
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    await userEvent.click(buttons[0])
    expect(setPendingConfirm).toHaveBeenCalledWith({
      approval: PENDING.APPROVAL.ACCEPT,
      pendingIds: ['item-1'],
    })

    rerender(renderButtons(false))
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })
})
