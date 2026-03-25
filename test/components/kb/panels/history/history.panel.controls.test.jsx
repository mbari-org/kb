import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import History from '@/components/kb/panels/History'
import { SELECTED } from '@/lib/constants/selected'

let mockSelectedType = SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT

vi.mock('@/contexts/panels/history/HistoryProvider', async () => {
  const { default: HistoryContext } = await import('@/contexts/panels/history/HistoryContext')
  return {
    default: ({ children }) => (
      <HistoryContext.Provider value={{ selectedType: mockSelectedType }}>
        {children}
      </HistoryContext.Provider>
    ),
  }
})

vi.mock('@/components/common/panel/usePanelFactory', () => ({
  default: () => ({
    createTablePanel: ({ header, tableHeader, tableData }) => (
      <div data-testid='history-panel'>
        <div data-testid='history-panel-header-left'>{header.headerLeft}</div>
        <div data-testid='history-panel-header-title'>{header.headerTitle}</div>
        <div data-testid='history-panel-header-right'>{header.headerRight}</div>
        <div data-testid='history-table-header-left'>{tableHeader.headerLeft}</div>
        <div data-testid='history-table-header-right'>{tableHeader.headerRight}</div>
        <div data-testid='history-table-data'>{tableData.content}</div>
      </div>
    ),
  }),
}))

vi.mock('@/components/kb/panels/history/header/HistoryHeaderLeft', () => ({
  default: () => <div data-testid='history-header-left-control' />,
}))

vi.mock('@/components/kb/panels/history/header/HistoryHeaderRight', () => ({
  default: () => <div data-testid='history-header-right-toggle' />,
}))

vi.mock('@/components/kb/panels/history/header/HistoryHeaderTitle', () => ({
  default: () => <div data-testid='history-header-title' />,
}))

vi.mock('@/components/kb/panels/history/table/header/HistoryTableHeaderLeft', () => ({
  default: () => <div data-testid='history-table-header-left-control' />,
}))

vi.mock('@/components/kb/panels/history/table/header/HistoryTableHeaderConceptRight', () => ({
  default: () => <div data-testid='history-table-concept-extent-control' />,
}))

vi.mock('@/components/kb/panels/history/table/data/HistoryTableConceptData', () => ({
  default: () => <div data-testid='history-table-concept-data' />,
}))

vi.mock('@/components/kb/panels/history/table/data/HistoryTableTypeData', () => ({
  default: () => <div data-testid='history-table-type-data' />,
}))

const renderPanel = selectedType => {
  mockSelectedType = selectedType
  render(<History />)
}

describe('History panel controls', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows concept-specific controls and concept data when history type is concept', () => {
    renderPanel(SELECTED.SETTINGS.HISTORY.TYPES.CONCEPT)

    expect(screen.getByTestId('history-header-left-control')).toBeInTheDocument()
    expect(screen.getByTestId('history-header-right-toggle')).toBeInTheDocument()
    expect(screen.getByTestId('history-header-title')).toBeInTheDocument()
    expect(screen.getByTestId('history-table-header-left-control')).toBeInTheDocument()
    expect(screen.getByTestId('history-table-concept-extent-control')).toBeInTheDocument()
    expect(screen.getByTestId('history-table-concept-data')).toBeInTheDocument()
    expect(screen.queryByTestId('history-table-type-data')).not.toBeInTheDocument()
  })

  it('hides concept extent control and shows type data when history type is pending', () => {
    renderPanel(SELECTED.SETTINGS.HISTORY.TYPES.PENDING)

    expect(screen.getByTestId('history-header-left-control')).toBeInTheDocument()
    expect(screen.getByTestId('history-header-right-toggle')).toBeInTheDocument()
    expect(screen.getByTestId('history-header-title')).toBeInTheDocument()
    expect(screen.getByTestId('history-table-header-left-control')).toBeInTheDocument()
    expect(screen.queryByTestId('history-table-concept-extent-control')).not.toBeInTheDocument()
    expect(screen.queryByTestId('history-table-concept-data')).not.toBeInTheDocument()
    expect(screen.getByTestId('history-table-type-data')).toBeInTheDocument()
  })

  it('hides concept extent control and shows type data when history type is approved', () => {
    renderPanel(SELECTED.SETTINGS.HISTORY.TYPES.APPROVED)

    expect(screen.getByTestId('history-header-left-control')).toBeInTheDocument()
    expect(screen.getByTestId('history-header-right-toggle')).toBeInTheDocument()
    expect(screen.getByTestId('history-header-title')).toBeInTheDocument()
    expect(screen.getByTestId('history-table-header-left-control')).toBeInTheDocument()
    expect(screen.queryByTestId('history-table-concept-extent-control')).not.toBeInTheDocument()
    expect(screen.queryByTestId('history-table-concept-data')).not.toBeInTheDocument()
    expect(screen.getByTestId('history-table-type-data')).toBeInTheDocument()
  })
})
