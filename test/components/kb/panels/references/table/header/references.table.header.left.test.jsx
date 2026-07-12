import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import ReferencesTableHeaderLeft from '@/components/kb/panels/references/table/header/ReferencesTableHeaderLeft'
const filteredReferencesMockFn = vi.hoisted(() => vi.fn())
vi.mock('@/components/kb/panels/references/useFilteredReferences', () => ({
  default: () => filteredReferencesMockFn(),
}))

vi.mock('@/components/kb/panels/references/table/header/useReferencesExport', () => ({
  default: () => vi.fn(),
}))

vi.mock('@/components/common/panel/PanelDataExport', () => ({
  default: ({ count }) => <div data-testid='references-count'>{count}</div>,
}))

describe('ReferencesTableHeaderLeft', () => {
  it('uses filtered references count for total', () => {
    filteredReferencesMockFn.mockReturnValue({
      byConcept: true,
      filteredReferences: [{ id: 1 }, { id: 2 }, { id: 3 }],
      selectedConcept: 'shark',
    })

    render(<ReferencesTableHeaderLeft />)

    expect(screen.getByTestId('references-count')).toHaveTextContent('3')
  })
})
