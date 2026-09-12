import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import HistoryTableTypeData from '@/components/kb/panels/history/table/data/HistoryTableTypeData'
import HistoryContext from '@/contexts/panels/history/HistoryContext'
import { CONCEPT } from '@/lib/constants'

const { TYPE } = CONCEPT.HISTORY

const gridProps = vi.hoisted(() => ({ current: null }))

vi.mock('@/components/common/panel/PanelDataGrid', () => ({
  default: props => {
    gridProps.current = props
    return (
      <div data-testid='grid'>
        {props.rows.map(row => (
          <span key={row.id} data-testid='row'>
            {row.id}
          </span>
        ))}
      </div>
    )
  },
}))

vi.mock('@/components/kb/panels/history/useHistoryColumns', () => ({
  default: () => [{ field: 'creationTimestamp' }],
}))

vi.mock('@/components/kb/panels/history/table/data/HistoryPagination', () => ({
  default: () => <div data-testid='pagination' />,
}))

const renderTable = ({
  selectedType,
  sortField = 'creationTimestamp',
  sortOrder = 'desc',
  updateSort = vi.fn(),
}) => {
  const value = {
    conceptState: { count: 3, data: [] },
    goToPage: vi.fn(),
    nextPage: vi.fn(),
    pageState: {
      data: [{ id: 'h1' }, { id: 'h2' }, { id: 'h3' }],
      limit: 25,
      offset: 0,
    },
    prevPage: vi.fn(),
    selectedType,
    setPageSize: vi.fn(),
    sortField,
    sortOrder,
    updateSort,
  }

  render(
    <HistoryContext.Provider value={value}>
      <HistoryTableTypeData />
    </HistoryContext.Provider>
  )

  return { updateSort }
}

const rowOrder = () => screen.getAllByTestId('row').map(node => node.textContent)

describe('HistoryTableTypeData approved sorting', () => {
  it('passes server-ordered rows through unreversed and sets server sorting props', () => {
    renderTable({ selectedType: TYPE.APPROVED, sortOrder: 'desc' })

    expect(rowOrder()).toEqual(['h1', 'h2', 'h3'])
    expect(gridProps.current.dataGridProps.sortingMode).toBe('server')
    expect(gridProps.current.dataGridProps.sortModel).toEqual([
      { field: 'creationTimestamp', sort: 'desc' },
    ])
  })

  it('reports grid sort changes through updateSort', () => {
    const { updateSort } = renderTable({ selectedType: TYPE.APPROVED })

    gridProps.current.dataGridProps.onSortModelChange([{ field: 'creatorName', sort: 'asc' }])

    expect(updateSort).toHaveBeenCalledWith({ field: 'creatorName', order: 'asc' })
  })

  it('ignores grid sort changes matching the current settings sort', () => {
    const { updateSort } = renderTable({
      selectedType: TYPE.APPROVED,
      sortField: 'creatorName',
      sortOrder: 'asc',
    })

    gridProps.current.dataGridProps.onSortModelChange([{ field: 'creatorName', sort: 'asc' }])

    expect(updateSort).not.toHaveBeenCalled()
  })
})

describe('HistoryTableTypeData pending sorting', () => {
  it('keeps client-side desc reversal and uncontrolled grid sorting', () => {
    renderTable({ selectedType: TYPE.PENDING, sortOrder: 'desc' })

    expect(rowOrder()).toEqual(['h3', 'h2', 'h1'])
    expect(gridProps.current.dataGridProps.sortingMode).toBeUndefined()
    expect(gridProps.current.dataGridProps.sortModel).toBeUndefined()
    expect(gridProps.current.dataGridProps.onSortModelChange).toBeDefined()
  })
})
