import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState, useCallback } from 'react'

import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'

import kbTheme from '@/lib/theme'
import Concepts from '@/components/kb/panels/Concepts'
import ConceptName from '@/components/kb/panels/concepts/concept/detail/ConceptName'
import CONFIG from '@/lib/config'
import { ACTION, HISTORY_FIELD, PENDING } from '@/lib/constants'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'
import ConceptModalProcessingContext from '@/contexts/panels/concepts/modal/ConceptModalProcessingContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'
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

const mockGetConcept = vi.fn(name => mockTaxonomy.conceptMap[name] ?? null)

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
  loadConceptDescendants: vi.fn(() => Promise.resolve(mockTaxonomy)),
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

const TestWrapper = ({
  children,
  dsgBaseUrl = '',
  initialConcept = rootConcept,
  pendingConcept = [],
  pendingHistory = [],
  pendingParent = [],
}) => {
  const [concept, setConcept] = useState(initialConcept)

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
    isLoading: false,
  }

  const mockSelectedSettingsValue = {
    settings: {},
    getSettings: () => ({}),
    setSettings: () => {},
    updateSettings: () => {},
  }

  const mockConceptModalValue = {
    setModal: vi.fn(),
    setModalData: vi.fn(),
    closeModal: vi.fn(),
    beginProcessing: vi.fn(),
    withProcessing: vi.fn(),
  }

  const mockConceptModalDataValue = {
    modal: null,
    modalData: {},
  }

  const mockConceptModalProcessingValue = {
    processing: false,
    processingMessage: null,
  }

  const mockPanelDataValue = {
    pendingHistory,
    templates: [],
    getConceptTemplates: vi.fn(() => []),
    getReferences: vi.fn(() => []),
    refreshData: vi.fn(),
    isLoading: false,
  }

  const mockUserValue = { user: { role: 'user' } }

  const mockAppModalValue = {
    beginProcessing: vi.fn(() => () => {}),
    setSuppressDisplay: vi.fn(),
  }

  return (
    <ThemeProvider theme={kbTheme}>
      <CssBaseline />
      <BrowserRouter>
        <UserContext.Provider value={mockUserValue}>
          <ConfigContext.Provider value={{ dsgBaseUrl }}>
          <AppModalContext.Provider value={mockAppModalValue}>
          <PanelDataContext.Provider value={mockPanelDataValue}>
            <TaxonomyContext.Provider value={mockTaxonomyValue}>
              <ConceptModalContext.Provider value={mockConceptModalValue}>
                <ConceptModalDataContext.Provider value={mockConceptModalDataValue}>
                  <ConceptModalProcessingContext.Provider value={mockConceptModalProcessingValue}>
            <SelectedContext.Provider value={mockSelectedValue}>
              <SelectedSettingsContext.Provider value={mockSelectedSettingsValue}>
                <ConceptContext.Provider
                  value={{
                    concept,
                    conceptPath: concept ? [concept.name] : null,
                    onConceptTreeReady: vi.fn(),
                    prepareConceptSwitch: vi.fn(),
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
                    pending: key => (key === PENDING.DATA.CONCEPT ? pendingConcept : pendingParent),
                  }}
                >
                  <ConceptStagedContext.Provider
                    value={{
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
                      modifyConcept: vi.fn(),
                    }}
                  >
                    {children}
                  </ConceptStagedContext.Provider>
                </ConceptContext.Provider>
              </SelectedSettingsContext.Provider>
            </SelectedContext.Provider>
                  </ConceptModalProcessingContext.Provider>
                </ConceptModalDataContext.Provider>
            </ConceptModalContext.Provider>
          </TaxonomyContext.Provider>
        </PanelDataContext.Provider>
          </AppModalContext.Provider>
          </ConfigContext.Provider>
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

describe('DSG link', () => {
  it('renders the concept name as a DSG link when dsgBaseUrl is set', () => {
    render(
      <TestWrapper dsgBaseUrl='https://dsg.example.com'>
        <Concepts />
      </TestWrapper>
    )

    const link = screen.getByRole('link', { name: CONFIG.PANELS.CONCEPTS.PANEL.TOOLTIP.DSG })
    expect(link).toHaveAttribute('href', 'https://dsg.example.com/root')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders the concept name as plain text when dsgBaseUrl is not set', () => {
    render(
      <TestWrapper>
        <Concepts />
      </TestWrapper>
    )

    expect(screen.queryByRole('link', { name: CONFIG.PANELS.CONCEPTS.PANEL.TOOLTIP.DSG })).not.toBeInTheDocument()
    expect(screen.getAllByText('root').length).toBeGreaterThan(0)
  })
})

describe('concept name pending deletion', () => {
  it('colors the name red for its pending deletion and restores its color when resolved', () => {
    const deletion = { concept: 'root', field: HISTORY_FIELD.CHILD, action: ACTION.DELETE, oldValue: 'object' }
    const renderName = pendingHistory => (
      <TestWrapper
        initialConcept={{ ...objectConcept, parent: 'stale parent' }}
        pendingHistory={pendingHistory}
        dsgBaseUrl='https://dsg.example.com'
      >
        <ConceptName />
      </TestWrapper>
    )
    const { rerender } = render(renderName([deletion]))
    const name = screen.getByRole('link', { name: CONFIG.PANELS.CONCEPTS.PANEL.TOOLTIP.DSG }).parentElement

    expect(name).toHaveStyle({ color: kbTheme.concept.color.remove })
    rerender(renderName([]))
    expect(name).toHaveStyle({ color: kbTheme.palette.primary.main })
  })

  it('does not color the name red for a different child or a pending change to its own children', () => {
    const otherDeletion = { concept: 'root', field: HISTORY_FIELD.CHILD, action: ACTION.DELETE, oldValue: 'entity' }
    const childDeletion = { field: HISTORY_FIELD.CHILD, action: ACTION.DELETE, oldValue: 'child' }
    const { rerender } = render(
      <TestWrapper initialConcept={objectConcept} pendingHistory={[otherDeletion]} pendingParent={[otherDeletion]}>
        <ConceptName />
      </TestWrapper>
    )

    expect(screen.getByText('object')).toHaveStyle({ color: kbTheme.palette.primary.main })
    rerender(
      <TestWrapper initialConcept={objectConcept} pendingConcept={[childDeletion]}>
        <ConceptName />
      </TestWrapper>
    )
    expect(screen.getByText('object')).toHaveStyle({ color: kbTheme.concept.color.edit })
  })
})

describe('concept name pending add', () => {
  it('colors the name green for a pending add even when the concept has other pending items', () => {
    const addition = { concept: 'root', field: HISTORY_FIELD.CHILD, action: ACTION.ADD, newValue: 'object' }
    const mediaItem = { concept: 'object', field: HISTORY_FIELD.MEDIA, action: ACTION.ADD, newValue: 'image.png' }

    render(
      <TestWrapper
        initialConcept={objectConcept}
        pendingConcept={[addition, mediaItem]}
        pendingHistory={[addition, mediaItem]}
        pendingParent={[addition]}
      >
        <ConceptName />
      </TestWrapper>
    )

    expect(screen.getByText('object')).toHaveStyle({ color: kbTheme.concept.color.add })
  })
})
