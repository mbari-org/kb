import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataProvider from '@/contexts/panel/data/PanelDataProvider'
import { LOADING } from '@/lib/constants/loading.js'

const {
  loadPendingHistoryMock,
  loadReferencesMock,
  loadTemplatesMock,
  showBoundaryMock,
} = vi.hoisted(() => ({
  loadPendingHistoryMock: vi.fn(),
  loadReferencesMock: vi.fn(),
  loadTemplatesMock: vi.fn(),
  showBoundaryMock: vi.fn(),
}))

vi.mock('react-error-boundary', () => ({
  useErrorBoundary: () => ({
    showBoundary: showBoundaryMock,
  }),
}))

vi.mock('@/contexts/panel/data/useLoadReferences', () => ({
  default: () => loadReferencesMock,
}))

vi.mock('@/contexts/panel/data/useLoadTemplates', () => ({
  default: () => loadTemplatesMock,
}))

vi.mock('@/contexts/panel/data/useLoadPendingHistory', () => ({
  default: () => loadPendingHistoryMock,
}))

describe('PanelDataProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()

    loadReferencesMock.mockImplementation(() => new Promise(() => {}))
    loadTemplatesMock.mockImplementation(() => new Promise(() => {}))
    loadPendingHistoryMock.mockImplementation(() => new Promise(() => {}))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('sends initial-load hangs to the error boundary instead of gating forever', async () => {
    render(
      <ConfigContext.Provider value={{ apiFns: {} }}>
        <PanelDataProvider>
          <div data-testid='panel-data-ready'>ready</div>
        </PanelDataProvider>
      </ConfigContext.Provider>
    )

    expect(screen.queryByTestId('panel-data-ready')).toBeNull()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(LOADING.STARTUP.PANEL_DATA_TIMEOUT_MS + 1)
      await vi.runAllTimersAsync()
      await Promise.resolve()
    })
    expect(showBoundaryMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Panel Data Load Timeout' })
    )
    expect(screen.getByTestId('panel-data-ready')).toBeInTheDocument()
  })
})
