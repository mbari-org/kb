import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState, useCallback } from 'react'

import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'

import kbTheme from '@/lib/theme'
import Concepts from '@/components/kb/panels/Concepts'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import CONFIG from '@/text'

const { CHANGE_NAME, CHANGE_PARENT, ADD_CHILD, DELETE_CONCEPT } = CONFIG.CONCEPT.STRUCTURE

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

const mockPanelSelect = {
  current: () => 'Concepts',
  push: () => {},
  getState: () => ['Concepts'],
  getPosition: () => 0,
  init: () => {},
  clear: () => {},
}

// Staged state for object with hasStagedChildren so CHANGE_NAME, CHANGE_PARENT, DELETE_CONCEPT are disabled
const objectStagedState = {
  name: { value: 'object', action: 'None' },
  parent: { action: 'None' },
  author: { value: '', action: 'None' },
  children: [{ action: 'Add Child', name: 'stagedChild', index: 0 }],
  deleteConcept: false,
  aliases: [],
  templates: [],
  rank: { action: 'None', level: '', name: '' },
  realizations: [],
  media: [],
}

const baseStagedState = {
  name: { value: 'root', action: 'None' },
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

const baseInitialState = {
  author: { value: '', action: 'None' },
  deleteConcept: false,
  aliases: [],
  templates: [],
  children: [],
  name: { value: 'root', action: 'None' },
  parent: { action: 'None' },
  rank: { action: 'None', level: '', name: '' },
  realizations: [],
  media: [],
}

const objectInitialState = {
  ...baseInitialState,
  name: { value: 'object', action: 'None' },
}

const TestWrapper = ({ children }) => {
  const [concept, setConcept] = useState(rootConcept)
  const [isEditing, setEditing] = useState(false)

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

  const mockAppModalValue = {
    beginProcessing: vi.fn(() => () => {}),
    setSuppressDisplay: vi.fn(),
  }

  const mockConfigValue = {
    apiFns: {
      apiPayload: vi.fn(() => Promise.resolve({})),
      apiRaw: vi.fn(() => Promise.resolve({})),
      apiResult: vi.fn(() => Promise.resolve({})),
      apiPaginated: vi.fn(() => Promise.resolve([])),
    },
  }

  const mockPanelDataValue = {
    pendingHistory: [],
    templates: [],
    getConceptTemplates: vi.fn(() => []),
    getReferences: vi.fn(() => []),
    refreshData: vi.fn(),
    isLoading: false,
  }

  // Admin role so Edit button and structure icon are enabled (not read-only)
  const mockUserValue = { user: { role: 'Admin' } }

  const stagedState = concept?.name === 'object' ? objectStagedState : baseStagedState
  const initialState = concept?.name === 'object' ? objectInitialState : baseInitialState

  return (
    <ThemeProvider theme={kbTheme}>
      <CssBaseline />
      <BrowserRouter>
        <UserContext.Provider value={mockUserValue}>
          <ConfigContext.Provider value={mockConfigValue}>
            <AppModalContext.Provider value={mockAppModalValue}>
              <PanelDataContext.Provider value={mockPanelDataValue}>
              <TaxonomyContext.Provider value={mockTaxonomyValue}>
                <ConceptModalContext.Provider value={mockConceptModalValue}>
                  <SelectedContext.Provider value={mockSelectedValue}>
                    <ConceptContext.Provider
                      value={{
                        concept,
                        conceptPath: concept ? [concept.name] : null,
                        onConceptTreeReady: vi.fn(),
                        stagedState: concept ? stagedState : null,
                        initialState: concept ? initialState : null,
                        isMarineOrganism: false,
                        isEditing,
                        setEditing,
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
            </AppModalContext.Provider>
          </ConfigContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

describe('concept object structure choices', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('selects object, clicks Edit, verifies isEditing, opens structure choices, verifies button states', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <Concepts />
      </TestWrapper>
    )

    // Enter 'object' in ConceptSelect
    const conceptInput = screen.getByRole('combobox')
    await user.click(conceptInput)
    await user.clear(conceptInput)
    await user.type(conceptInput, 'object')

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'object' })).toBeInTheDocument()
    })
    await user.click(screen.getByRole('option', { name: 'object' }))

    await waitFor(() => {
      expect(screen.getAllByText('object').length).toBeGreaterThan(0)
    })

    // Select the Edit button (ConceptEditingActions)
    const editButton = screen.getByRole('button', { name: 'Edit' })
    expect(editButton).toBeInTheDocument()
    await user.click(editButton)

    // Verify ConceptProvider context has isEditing true - ConceptStructureIcon only shows when isEditing
    // ConceptStructureIcon is an IconButton with tooltip "Edit Concept Structure"
    await waitFor(() => {
      const structureIcon = screen.getByRole('button', { name: /edit concept structure/i })
      expect(structureIcon).toBeInTheDocument()
    })

    // Verify ConceptView ConceptName has ConceptStructureIcon - click it
    const structureIcon = screen.getByRole('button', { name: /edit concept structure/i })
    await user.click(structureIcon)

    // Verify ChangeStructureChoices is displayed
    await waitFor(() => {
      expect(screen.getByText(CHANGE_NAME)).toBeInTheDocument()
      expect(screen.getByText(CHANGE_PARENT)).toBeInTheDocument()
      expect(screen.getByText(ADD_CHILD)).toBeInTheDocument()
      expect(screen.getByText(DELETE_CONCEPT)).toBeInTheDocument()
    })

    // Verify CHANGE_NAME, CHANGE_PARENT, DELETE_CONCEPT buttons are disabled
    const changeNameButton = screen.getByRole('button', { name: CHANGE_NAME })
    const changeParentButton = screen.getByRole('button', { name: CHANGE_PARENT })
    const deleteConceptButton = screen.getByRole('button', { name: DELETE_CONCEPT })
    expect(changeNameButton).toBeDisabled()
    expect(changeParentButton).toBeDisabled()
    expect(deleteConceptButton).toBeDisabled()

    // Verify ADD_CHILD button is enabled
    const addChildButton = screen.getByRole('button', { name: ADD_CHILD })
    expect(addChildButton).toBeEnabled()
  })
})
