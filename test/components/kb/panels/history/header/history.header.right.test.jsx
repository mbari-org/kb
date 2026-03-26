import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import HistoryHeaderRight from '@/components/kb/panels/history/header/HistoryHeaderRight'
import HistoryContext from '@/contexts/panels/history/HistoryContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import { SELECTED } from '@/lib/constants/selected'

const renderHeaderRight = ({
  selectedType = SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT,
} = {}) => {
  const updateSettings = vi.fn()

  render(
    <HistoryContext.Provider value={{ selectedType }}>
      <SelectedContext.Provider value={{ updateSettings }}>
        <HistoryHeaderRight />
      </SelectedContext.Provider>
    </HistoryContext.Provider>
  )

  return { updateSettings }
}

describe('HistoryHeaderRight', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders history type toggle buttons', () => {
    renderHeaderRight()

    expect(screen.getByRole('button', { name: SELECTED.SETTINGS.HISTORY.TYPES.APPROVED })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: SELECTED.SETTINGS.HISTORY.TYPES.PENDING })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT })).toBeInTheDocument()
  })

  it('marks approved toggle as selected when approved is the current history type', () => {
    renderHeaderRight({
      selectedType: SELECTED.SETTINGS.HISTORY.TYPES.APPROVED,
    })

    expect(
      screen.getByRole('button', { name: SELECTED.SETTINGS.HISTORY.TYPES.APPROVED })
    ).toHaveAttribute('aria-pressed', 'true')
  })

  it('marks pending toggle as selected when pending is the current history type', () => {
    renderHeaderRight({
      selectedType: SELECTED.SETTINGS.HISTORY.TYPES.PENDING,
    })

    expect(
      screen.getByRole('button', { name: SELECTED.SETTINGS.HISTORY.TYPES.PENDING })
    ).toHaveAttribute('aria-pressed', 'true')
  })

  it('updates selected history type when a different toggle button is chosen', async () => {
    const user = userEvent.setup()
    const { updateSettings } = renderHeaderRight({
      selectedType: SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT,
    })

    await user.click(screen.getByRole('button', { name: SELECTED.SETTINGS.HISTORY.TYPES.APPROVED }))

    expect(updateSettings).toHaveBeenCalledWith({
      [SELECTED.SETTINGS.HISTORY.KEY]: {
        [SELECTED.SETTINGS.HISTORY.TYPE]: SELECTED.SETTINGS.HISTORY.TYPES.APPROVED,
      },
    })
  })

  it('updates selected history type to pending when pending toggle is chosen', async () => {
    const user = userEvent.setup()
    const { updateSettings } = renderHeaderRight({
      selectedType: SELECTED.SETTINGS.HISTORY.TYPES.APPROVED,
    })

    await user.click(screen.getByRole('button', { name: SELECTED.SETTINGS.HISTORY.TYPES.PENDING }))

    expect(updateSettings).toHaveBeenCalledWith({
      [SELECTED.SETTINGS.HISTORY.KEY]: {
        [SELECTED.SETTINGS.HISTORY.TYPE]: SELECTED.SETTINGS.HISTORY.TYPES.PENDING,
      },
    })
  })

  it('ignores null selection when clicking currently-selected toggle button', async () => {
    const user = userEvent.setup()
    const { updateSettings } = renderHeaderRight({
      selectedType: SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT,
    })

    await user.click(screen.getByRole('button', { name: SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT }))

    expect(updateSettings).not.toHaveBeenCalled()
  })
})
