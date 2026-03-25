import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { use, useState, useCallback, useReducer, useEffect, useMemo } from 'react'

import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'

import kbTheme from '@/lib/theme'
import Concepts from '@/components/kb/panels/Concepts'
import ConceptModal from '@/components/modal/ConceptModal'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalProvider from '@/contexts/panels/concepts/modal/ConceptModalProvider'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import PreferencesContext from '@/contexts/preferences/PreferencesContext'
import RefreshContext from '@/contexts/refresh/RefreshContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import CONFIG from '@/text'
import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'
import useModifyConcept from '@/contexts/panels/concepts/staged/edit/useModifyConcept'
import { initialConceptState } from '@/lib/concept/state/state'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const { ADD_CHILD } = CONFIG.CONCEPT.STRUCTURE

const ConceptModalRenderer = () => {
  const { modal } = use(ConceptModalContext)
  return modal ? <ConceptModal /> : null
}

// Mock concept data
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
  if (name === 'entity') return entityConcept
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

const TestWrapper = ({ children }) => {
  const [concept, setConcept] = useState(rootConcept)
  const initialState = useMemo(
    () => (concept ? initialConceptState({ ...concept, templates: [] }, []) : null),
    [concept]
  )
  const [stagedState, dispatch] = useReducer(conceptStateReducer, {})
  const [confirmReset, setConfirmReset] = useState(null)
  const [isEditing, setEditing] = useState(false)

  useEffect(() => {
    if (initialState) {
      dispatch({ type: CONCEPT_STATE.INITIAL, update: initialState })
    }
  }, [initialState])

  const modifyConcept = useModifyConcept(dispatch, initialState, setConfirmReset)

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

  const mockUserValue = {
    user: { role: 'Admin' },
    getPreferences: vi.fn(() => Promise.resolve({})),
  }
  const mockRefreshValue = { refresh: vi.fn(() => Promise.resolve()) }
  const mockPreferencesValue = { savePreferences: vi.fn(() => Promise.resolve()) }

  return (
    <ThemeProvider theme={kbTheme}>
      <CssBaseline />
      <BrowserRouter>
        <UserContext.Provider value={mockUserValue}>
          <ConfigContext.Provider value={mockConfigValue}>
            <AppModalContext.Provider value={mockAppModalValue}>
              <PanelDataContext.Provider value={mockPanelDataValue}>
                <PreferencesContext.Provider value={mockPreferencesValue}>
                  <RefreshContext.Provider value={mockRefreshValue}>
                    <TaxonomyContext.Provider value={mockTaxonomyValue}>
                      <ConceptModalProvider>
                        <SelectedContext.Provider value={mockSelectedValue}>
                          <ConceptContext.Provider
                            value={{
                              concept,
                              conceptPath: concept ? [concept.name] : null,
                              onConceptTreeReady: vi.fn(),
                              stagedState,
                              initialState,
                              isMarineOrganism: false,
                              isEditing,
                              setEditing,
                              modifyConcept,
                              confirmReset,
                              pending: () => [],
                            }}
                          >
                            {children}
                            <ConceptModalRenderer />
                          </ConceptContext.Provider>
                        </SelectedContext.Provider>
                      </ConceptModalProvider>
                    </TaxonomyContext.Provider>
                  </RefreshContext.Provider>
                </PreferencesContext.Provider>
              </PanelDataContext.Provider>
            </AppModalContext.Provider>
          </ConfigContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

describe('concept object add child discard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adds child dingo, stages, discards all, verifies ConceptStructureIcon is hidden', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <Concepts />
      </TestWrapper>
    )

    // Select concept 'object' in ConceptSelect (as in structure choices test)
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

    // Click Edit to enter editing mode
    const editButton = screen.getByRole('button', { name: 'Edit' })
    await user.click(editButton)

    // Click structure choices icon
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /edit concept structure/i })).toBeInTheDocument()
    })
    const structureIcon = screen.getByRole('button', { name: /edit concept structure/i })
    await user.click(structureIcon)

    // Click ADD_CHILD button
    await waitFor(() => {
      expect(screen.getByText(ADD_CHILD)).toBeInTheDocument()
    })
    const addChildButton = screen.getByRole('button', { name: ADD_CHILD })
    await user.click(addChildButton)

    // In the add child modal: enter name 'dingo' and author 'me'
    await waitFor(() => {
      expect(screen.getByText('Add child')).toBeInTheDocument()
    })
    const nameInput = screen.getByRole('textbox', { name: /name/i })
    const authorInput = screen.getByRole('textbox', { name: /author/i })
    await user.clear(nameInput)
    await user.type(nameInput, 'dingo')
    await user.clear(authorInput)
    await user.type(authorInput, 'me')

    // Wait for debounced modalData update (333ms) so Stage button becomes enabled
    await waitFor(
      async () => {
        const stageButton = screen.getByRole('button', { name: 'Stage' })
        expect(stageButton).toBeEnabled()
      },
      { timeout: 500 }
    )

    // Click Stage
    const stageButton = screen.getByRole('button', { name: 'Stage' })
    await user.click(stageButton)

    // Click Discard All in ConceptEditingActions
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Discard All' })).toBeInTheDocument()
    })
    const discardAllButton = screen.getByRole('button', { name: 'Discard All' })
    await user.click(discardAllButton)

    // In the confirmation modal, click Discard to confirm
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument()
    })
    const confirmDiscardButton = screen.getByRole('button', { name: 'Discard' })
    await user.click(confirmDiscardButton)

    // Verify ConceptStructureIcon is not displayed
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /edit concept structure/i })).not.toBeInTheDocument()
    })
  })
})
