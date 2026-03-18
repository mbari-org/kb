import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import NavHistoryLinks from '@/components/common/NavHistoryLinks'

vi.mock('@/components/common/NavHistoryButton', () => ({
  default: ({ disabled, label, onClick, onItemSelect }) => (
    <button
      aria-label={label}
      data-disabled={disabled ? 'true' : 'false'}
      onClick={() => {
        onClick?.()
        onItemSelect?.(1)
      }}
      type='button'
    >
      {label}
    </button>
  ),
}))

describe('NavHistoryLinks', () => {
  it('returns null without history', () => {
    const { container } = render(<NavHistoryLinks history={null} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('wires history actions for direct and indexed navigation', async () => {
    const user = userEvent.setup()
    const history = {
      back: vi.fn(),
      backItems: vi.fn(() => ['Concepts', 'Templates']),
      canGoBack: vi.fn(() => true),
      canGoForward: vi.fn(() => true),
      forward: vi.fn(),
      forwardItems: vi.fn(() => ['History']),
      goBack: vi.fn(),
      goForward: vi.fn(),
    }

    render(<NavHistoryLinks history={history} />)

    await user.click(screen.getByRole('button', { name: 'previous' }))
    await user.click(screen.getByRole('button', { name: 'next' }))

    expect(history.back).toHaveBeenCalledTimes(1)
    expect(history.forward).toHaveBeenCalledTimes(1)
    expect(history.goBack).toHaveBeenCalledWith(2)
    expect(history.goForward).toHaveBeenCalledWith(2)
    expect(history.canGoBack).toHaveBeenCalled()
    expect(history.canGoForward).toHaveBeenCalled()
    expect(history.backItems).toHaveBeenCalled()
    expect(history.forwardItems).toHaveBeenCalled()
  })
})
