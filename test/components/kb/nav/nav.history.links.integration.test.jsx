import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import NavHistoryLinks from '@/components/common/NavHistoryLinks'
import usePanelSelection from '@/contexts/selected/usePanelSelection'

const PanelHistoryHarness = () => {
  const panels = usePanelSelection()

  return (
    <>
      <NavHistoryLinks history={panels} />

      <button onClick={() => panels.push('Templates')} type='button'>
        push templates
      </button>
      <button onClick={() => panels.push('History')} type='button'>
        push history
      </button>

      <div data-testid='current-panel'>{panels.current()}</div>
    </>
  )
}

describe('NavHistoryLinks integration', () => {
  it('moves panel tracking state backward and forward from nav buttons', async () => {
    const user = userEvent.setup()

    render(<PanelHistoryHarness />)

    expect(screen.getByTestId('current-panel')).toHaveTextContent('Concepts')

    await user.click(screen.getByRole('button', { name: 'push templates' }))
    await user.click(screen.getByRole('button', { name: 'push history' }))
    expect(screen.getByTestId('current-panel')).toHaveTextContent('History')

    await user.click(screen.getByRole('button', { name: 'previous' }))
    expect(screen.getByTestId('current-panel')).toHaveTextContent('Templates')

    await user.click(screen.getByRole('button', { name: 'next' }))
    expect(screen.getByTestId('current-panel')).toHaveTextContent('History')
  })
})
