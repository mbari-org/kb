import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState, useCallback } from 'react'

import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'

import kbTheme from '@/lib/theme'
import Concepts from '@/components/kb/panels/Concepts'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

// Mock concept data - buildTree expects conceptMap[child] for each child
const rootConcept = {
  name: 'root',
  parent: null,
  children: ['object', 'entity'],
  aliases: [],
  alternateNames: [],
  media: [],
  realizations: [],
  references: [],
  templates: [],
}

const objectConcept = {
  name: 'object',
  parent: 'root',
  children: [],
  aliases: [],
  alternateNames: [],
  media: [],
  realizations: [],
  references: [],
  templates: [],
}

const entityConcept = {
  name: 'entity',
  parent: 'root',
  children: [],
  aliases: [],
  alternateNames: [],
  media: [],
  realizations: [],
  references: [],
  templates: [],
}

const mockGetConcept = vi.fn(name => {
  if (name === 'object') return objectConcept
  if (name === 'root') return rootConcept
  return null
})

const mockGetNames = vi.fn(() => ['object', 'entity', 'root'])
const mockIsConceptLoaded = vi.fn(() => true)
const mockLoadConcept = vi.fn(name => Promise.resolve(mockGetConcept(name)))
const mockGetRootName = vi.fn(() => 'root')

const mockTaxonomy = {
  rootName: 'root',
  names: ['object', 'entity', 'root'],
  conceptMap: {
    root: rootConcept,
    object: objectConcept,
    entity: entityConcept,
  },
  aliasMap: {},
}

const mockTaxonomyValue = {
  getNames: mockGetNames,
  getConcept: mockGetConcept,
  getConceptPrimaryName: name => name,
  getAncestorNames: () => [],
  isConceptLoaded: mockIsConceptLoaded,
  loadConcept: mockLoadConcept,
  getRootName: mockGetRootName,
  isRoot: (taxonomy, concept) => concept?.name === taxonomy?.rootName,
  filterRanks: () => [],
  taxonomy: mockTaxonomy,
}

// ConceptSelect calls updateSelected({ concept: selectedName })
// ConceptProvider would load concept and set it - we simulate with state
const mockPanelSelect = {
  current: () => 'Concepts',
  push: () => {},
  getState: () => ['Concepts'],
  getPosition: () => 0,
  init: () => {},
  clear: () => {},
}

const TestWrapper = ({ children }) => {
  const [concept, setConcept] = useState(rootConcept)

  const mockConceptSelect = {
    current: () => concept?.name,
    push: name => {
      const newConcept = mockGetConcept(name)
      if (newConcept) setConcept(newConcept)
    },
    getState: () => [concept?.name],
    getPosition: () => 0,
    init: data => {
      if (data?.state?.[0]) {
        const c = mockGetConcept(data.state[0])
        if (c) setConcept(c)
      }
    },
    clear: () => setConcept(null),
    back: () => concept?.name,
    forward: () => concept?.name,
    canGoBack: () => false,
    canGoForward: () => false,
    backItems: () => [],
    forwardItems: () => [],
    goBack: () => concept?.name,
    goForward: () => concept?.name,
  }

  const mockGetSelected = useCallback(key => {
    if (key === 'concept') return concept?.name
    return 'Concepts'
  }, [concept])

  const mockUpdateSelected = useCallback(({ concept: conceptName }) => {
    if (conceptName) {
      const newConcept = mockGetConcept(conceptName)
      if (newConcept) setConcept(newConcept)
    }
  }, [])

  const mockSelectedValue = {
    concepts: mockConceptSelect,
    panels: mockPanelSelect,
    getSelected: mockGetSelected,
    updateSelected: mockUpdateSelected,
    settings: {},
    getSettings: () => ({}),
    setSettings: () => {},
    updateSettings: () => {},
    isLoading: false,
  }

  const mockConceptModalValue = {
    setModal: vi.fn(),
    setModalData: vi.fn(),
    closeModal: vi.fn(),
    modal: null,
    modalData: {},
    processing: false,
    processingMessage: null,
    beginProcessing: vi.fn(),
    withProcessing: vi.fn(),
  }

  const mockPanelDataValue = {
    pendingHistory: [],
    templates: [],
    getConceptTemplates: vi.fn(() => []),
    getReferences: vi.fn(() => []),
    refreshData: vi.fn(),
    isLoading: false,
  }

  const mockUserValue = { user: { role: 'user' } }

  return (
    <ThemeProvider theme={kbTheme}>
      <CssBaseline />
      <BrowserRouter>
        <UserContext.Provider value={mockUserValue}>
          <PanelDataContext.Provider value={mockPanelDataValue}>
            <TaxonomyContext.Provider value={mockTaxonomyValue}>
              <ConceptModalContext.Provider value={mockConceptModalValue}>
            <SelectedContext.Provider value={mockSelectedValue}>
              <ConceptContext.Provider
                value={{
                  concept,
                  conceptPath: concept ? [concept.name] : null,
                  onConceptTreeReady: vi.fn(),
                  stagedState: concept
                    ? {
                        name: { value: concept.name, action: 'None' },
                        parent: { action: 'None' },
                        author: { value: '', action: 'None' },
                        children: [],
                        deleteConcept: false,
                        aliases: [],
                        templates: [],
                        rank: { action: 'None', level: '', name: '' },
                        realizations: [],
                        media: [],
                      }
                    : null,
                  initialState: concept
                    ? {
                        author: { value: '', action: 'None' },
                        deleteConcept: false,
                        aliases: [],
                        templates: [],
                        children: [],
                        name: { value: concept.name, action: 'None' },
                        parent: { action: 'None' },
                        rank: { action: 'None', level: '', name: '' },
                        realizations: [],
                        media: [],
                      }
                    : null,
                  isMarineOrganism: false,
                  isEditing: false,
                  modifyConcept: vi.fn(),
                  pending: () => [],
                }}
              >
                {children}
              </ConceptContext.Provider>
              </SelectedContext.Provider>
            </ConceptModalContext.Provider>
          </TaxonomyContext.Provider>
        </PanelDataContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

describe('panel integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('enters "object" in ConceptSelect and displays concept name in ConceptName Typography', async () => {
    const user = userEvent.setup()

    // Start with root concept - ConceptsSidebar renders ConceptSelect, Concept shows ConceptName
    render(
      <TestWrapper>
        <Concepts />
      </TestWrapper>
    )

    // Initially shows root concept name (in ConceptName Typography and tree)
    expect(screen.getAllByText('root').length).toBeGreaterThan(0)

    // Find the Concept autocomplete input - MUI Autocomplete renders a combobox (no accessible name)
    const conceptInput = screen.getByRole('combobox')
    expect(conceptInput).toBeInTheDocument()

    // Type 'object' in the input
    await user.click(conceptInput)
    await user.clear(conceptInput)
    await user.type(conceptInput, 'object')

    // Select 'object' from the dropdown - MUI Autocomplete shows options
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'object' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('option', { name: 'object' }))

    // Verify the Concepts panel shows the 'object' concept - ConceptName Typography displays concept.name
    await waitFor(() => {
      expect(screen.getAllByText('object').length).toBeGreaterThan(0)
    })
  })
})
