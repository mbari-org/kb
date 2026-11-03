import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'

import ConceptsTree from '@/components/kb/panels/concepts/sidebar/tree/ConceptsTree'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

let lastTreeViewProps = null
const mockScrollToNode = vi.fn(() => () => {})
const mockTreeItems = [{ id: 'root', children: [] }]
const mockBuildTree = vi.fn(() => mockTreeItems)
const mockGetItemDOMElement = vi.fn(() => null)
const mockItemClick = vi.fn()
const mockExpandConcept = vi.fn()

vi.mock('@mui/x-tree-view/RichTreeView', () => ({
  RichTreeView: props => {
    lastTreeViewProps = props
    return <div data-testid='rich-tree-view' />
  },
}))

vi.mock('@mui/x-tree-view', () => ({
  useRichTreeViewApiRef: () => ({ current: { getItemDOMElement: mockGetItemDOMElement } }),
}))

vi.mock('@/components/kb/panels/concepts/sidebar/tree/lib/useArrowKeys', () => ({
  default: vi.fn(),
}))

vi.mock('@/components/kb/panels/concepts/sidebar/tree/lib/useConceptAutoExpand', () => ({
  default: vi.fn(),
}))

vi.mock('@/components/kb/panels/concepts/sidebar/tree/lib/useConceptClick', () => ({
  default: () => mockItemClick,
}))

vi.mock('@/components/kb/panels/concepts/sidebar/tree/lib/useExpandConcept', () => ({
  default: () => mockExpandConcept,
}))

vi.mock('@/components/kb/panels/concepts/sidebar/tree/lib/useConceptsTreeScroll', () => ({
  default: () => ({ scrollToNode: mockScrollToNode }),
}))

vi.mock('@/lib/model/taxonomy', () => ({
  buildTreeItems: taxonomy => mockBuildTree(taxonomy),
}))

const renderTree = ({
  concept = { name: 'dingo' },
  conceptPath = ['root', 'dingo'],
  getConcept = () => ({ name: 'dingo' }),
  updateSelected = vi.fn(),
  registerScrollFn = vi.fn(),
} = {}) => {
  const taxonomy = { rootName: 'root' }

  return render(
    <ConceptContext.Provider value={{ concept, conceptPath, onConceptTreeReady: vi.fn() }}>
      <SelectedContext.Provider value={{ updateSelected }}>
        <TaxonomyContext.Provider
          value={{
            getConcept,
            getConceptPrimaryName: name => name,
            taxonomy,
          }}
        >
          <ConceptsTree autoExpand={null} registerScrollFn={registerScrollFn} setAutoExpand={vi.fn()} />
        </TaxonomyContext.Provider>
      </SelectedContext.Provider>
    </ConceptContext.Provider>
  )
}

describe('ConceptsTree', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    lastTreeViewProps = null
  })

  it('renders nothing when no concept is selected', () => {
    renderTree({ concept: null, conceptPath: [] })
    expect(screen.queryByTestId('rich-tree-view')).not.toBeInTheDocument()
  })

  it('renders RichTreeView with selected concept and tree items', () => {
    renderTree()

    expect(screen.getByTestId('rich-tree-view')).toBeInTheDocument()
    expect(lastTreeViewProps.selectedItems).toEqual(['dingo'])
    expect(lastTreeViewProps.items).toEqual([{ id: 'root', children: [] }])
    expect(mockBuildTree).toHaveBeenCalledTimes(1)
  })

  it('keeps the items array referentially stable when the root node is unchanged', () => {
    const taxonomy = { rootName: 'root' }
    const renderWithConcept = concept => (
      <ConceptContext.Provider value={{ concept, conceptPath: ['root', concept.name], onConceptTreeReady: vi.fn() }}>
        <SelectedContext.Provider value={{ updateSelected: vi.fn() }}>
          <TaxonomyContext.Provider
            value={{ getConcept: () => concept, getConceptPrimaryName: name => name, taxonomy }}
          >
            <ConceptsTree autoExpand={null} registerScrollFn={vi.fn()} setAutoExpand={vi.fn()} />
          </TaxonomyContext.Provider>
        </SelectedContext.Provider>
      </ConceptContext.Provider>
    )

    const { rerender } = render(renderWithConcept({ name: 'dingo' }))
    const firstItems = lastTreeViewProps.items

    rerender(renderWithConcept({ name: 'object' }))

    expect(lastTreeViewProps.selectedItems).toEqual(['object'])
    expect(lastTreeViewProps.items).toBe(firstItems)
  })

  it('registers an external scroll handler that calls scrollToNode', () => {
    const registerScrollFn = vi.fn()
    renderTree({ registerScrollFn })

    expect(registerScrollFn).toHaveBeenCalledTimes(1)
    const registeredScrollHandler = registerScrollFn.mock.calls[0][0]
    registeredScrollHandler()

    expect(mockScrollToNode.mock.calls.some(call => call.length === 0)).toBe(true)
  })

  it('expands concept path items after effect tick', async () => {
    vi.useFakeTimers()
    try {
      renderTree({ conceptPath: ['root', 'object', 'dingo'] })

      expect(lastTreeViewProps.expandedItems).toEqual([])

      await act(async () => {
        vi.runOnlyPendingTimers()
      })

      expect(lastTreeViewProps.expandedItems).toEqual(
        expect.arrayContaining(['root', 'object', 'dingo'])
      )
    } finally {
      vi.useRealTimers()
    }
  })
})
