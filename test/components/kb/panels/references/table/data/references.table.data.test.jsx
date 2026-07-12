import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

import ReferencesTableData from '@/components/kb/panels/references/table/data/ReferencesTableData'
import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { CONCEPT } from '@/lib/constants'
import { SELECTED } from '@/lib/constants/selected.js'

vi.mock('@/components/common/panel/PanelDataGrid', () => ({
  default: ({ rows, rowCount }) => (
    <div data-testid='references-table'>
      <div data-testid='row-count'>{rowCount}</div>
      {rows.map(row => (
        <div key={row.id} data-testid='reference-row'>
          <span data-testid='row-id'>{row.id}</span>
          <span data-testid='row-citation'>{row.citation}</span>
        </div>
      ))}
    </div>
  ),
}))

vi.mock('@/components/kb/panels/references/table/data/useReferenceColumns', () => ({
  default: () => [{ field: 'citation', headerName: 'Citation' }],
}))

vi.mock('@/components/kb/panels/references/table/data/useEditReferenceButton', () => ({
  default: () => vi.fn(),
}))

vi.mock('@/components/kb/panels/references/table/data/useDeleteReferenceButton', () => ({
  default: () => vi.fn(),
}))

vi.mock('@/components/kb/panels/references/table/data/ReferencesPagination', () => ({
  default: () => <div data-testid='references-pagination' />,
}))

const getDescendantNamesMock = vi.hoisted(() => vi.fn())
vi.mock('@/lib/model/concept', () => ({
  getDescendantNames: (...args) => getDescendantNamesMock(...args),
}))

const references = [
  { id: 'r1', citation: 'alpha one', concepts: ['shark'] },
  { id: 'r2', citation: 'beta two', concepts: ['shark-child'] },
  { id: 'r3', citation: 'alpha three', concepts: ['shark-grandchild'] },
  { id: 'r4', citation: 'alpha other', concepts: ['other'] },
]

const renderTable = ({ byConcept, citationGlob, conceptExtent }) => {
  const getReferences = conceptName =>
    conceptName
      ? references.filter(reference => reference.concepts.includes(conceptName))
      : references

  const getSelected = key => (key === SELECTED.CONCEPT ? 'shark' : null)
  const getSettings = (key, setting) =>
    key === SELECTED.SETTINGS.REFERENCES.KEY && setting === SELECTED.SETTINGS.REFERENCES.BY_CONCEPT
      ? byConcept
      : null

  return render(
    <ConfigContext value={{ apiFns: { apiPayload: vi.fn() } }}>
      <PanelDataContext value={{ getReferences }}>
        <ReferencesContext
          value={{
            citationGlob,
            conceptExtent,
          }}
        >
          <SelectedContext value={{ getSelected, getSettings }}>
            <TaxonomyContext value={{ getConcept: () => ({ children: ['shark-child'] }) }}>
              <ReferencesTableData />
            </TaxonomyContext>
          </SelectedContext>
        </ReferencesContext>
      </PanelDataContext>
    </ConfigContext>
  )
}

describe('ReferencesTableData filtering', () => {
  it('filters by selected concept when extent is solo', () => {
    renderTable({
      byConcept: true,
      citationGlob: 'alpha',
      conceptExtent: CONCEPT.EXTENT.SOLO,
    })

    expect(screen.getByTestId('row-count')).toHaveTextContent('1')
    expect(screen.getAllByTestId('row-id').map(node => node.textContent)).toEqual(['r1'])
  })

  it('includes selected concept and children when extent is children', () => {
    renderTable({
      byConcept: true,
      citationGlob: '',
      conceptExtent: CONCEPT.EXTENT.CHILDREN,
    })

    expect(screen.getByTestId('row-count')).toHaveTextContent('2')
    expect(screen.getAllByTestId('row-id').map(node => node.textContent)).toEqual(['r1', 'r2'])
  })

  it('includes descendants and still applies citation filtering', async () => {
    getDescendantNamesMock.mockResolvedValueOnce(['shark-child', 'shark-grandchild'])

    renderTable({
      byConcept: true,
      citationGlob: 'alpha',
      conceptExtent: CONCEPT.EXTENT.DESCENDANTS,
    })

    await waitFor(() => {
      expect(screen.getByTestId('row-count')).toHaveTextContent('2')
    })
    expect(screen.getAllByTestId('row-id').map(node => node.textContent)).toEqual(['r1', 'r3'])
  })
})
