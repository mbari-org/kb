/* eslint-disable react-refresh/only-export-components */
import { vi } from 'vitest'
import { use, useState, useCallback, useReducer, useEffect, useMemo } from 'react'

import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'

import kbTheme from '@/lib/theme'
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

import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'
import useModifyConcept from '@/contexts/panels/concepts/staged/edit/useModifyConcept'
import { initialConceptState } from '@/lib/concept/state/state'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const BASE_URL = 'http://localhost:8123'

export const MEDIA_URLS = {
  IMAGE: {
    head_01: `${BASE_URL}/head_01.jpg`,
    pack: `${BASE_URL}/pack.jpg`,
    pup: `${BASE_URL}/pup.jpg`,
    side_01: `${BASE_URL}/side_01.jpg`,
    side_02: `${BASE_URL}/side_02.jpg`,
  },
  VIDEO: {
    beach: `${BASE_URL}/beach.mov`,
    tree: `${BASE_URL}/tree.mp4`,
  },
  ICON: {
    dingosky: `${BASE_URL}/dingosky.ico`,
  },
}

const ConceptModalRenderer = () => {
  const { modal } = use(ConceptModalContext)
  return modal ? <ConceptModal /> : null
}

const createConceptWithState = (name, { aliases = [], media = [], realizations = [], references = [] } = {}) => ({
  name,
  parent: 'root',
  children: [],
  aliases,
  alternateNames: aliases.map(alias => alias.name),
  media,
  realizations,
  references,
  templates: [],
})

export const createMediaItem = ({ url, credit = 'Test Credit', caption = '', isPrimary = false, id = null }) => ({
  id,
  url,
  credit,
  caption,
  isPrimary,
})

const rootConcept = {
  name: 'root',
  parent: null,
  children: ['dingo', 'object'],
  aliases: [],
  alternateNames: [],
  media: [],
  realizations: [],
  references: [],
  templates: [],
}

const objectConcept = createConceptWithState('object')

const createDingoConcept = ({ aliases = [], media = [], realizations = [], references = [] } = {}) =>
  createConceptWithState('dingo', { aliases, media, realizations, references })

export const createMockTaxonomy = conceptMap => {
  const names = Object.keys(conceptMap)
  return {
    rootName: 'root',
    names,
    conceptMap,
    aliasMap: {},
  }
}

export const createMockTaxonomyValue = (taxonomy, getConcept) => ({
  getNames: vi.fn(() => taxonomy.names),
  getConcept,
  getConceptPrimaryName: name => name,
  getAncestorNames: () => [],
  isConceptLoaded: vi.fn(() => true),
  loadConcept: vi.fn(name => Promise.resolve(getConcept(name))),
  getRootName: vi.fn(() => 'root'),
  isRoot: (tax, concept) => concept?.name === tax?.rootName,
  filterRanks: () => [],
  taxonomy,
})

const mockPanelSelect = {
  current: () => 'Concepts',
  push: () => {},
  getState: () => ['Concepts'],
  getPosition: () => 0,
  init: () => {},
  clear: () => {},
}

const mergeSettings = (current, update) => {
  if (!update || typeof update !== 'object') {
    return current
  }

  return Object.keys(update).reduce((acc, key) => {
    const currentValue = acc[key]
    const updateValue = update[key]

    const canMerge =
      currentValue && typeof currentValue === 'object' && !Array.isArray(currentValue) &&
      updateValue && typeof updateValue === 'object' && !Array.isArray(updateValue)

    if (canMerge) {
      acc[key] = mergeSettings(currentValue, updateValue)
    } else {
      acc[key] = updateValue
    }
    return acc
  }, { ...current })
}

export const ConceptPanelTestWrapper = ({
  children,
  initialAliases = [],
  initialMedia = [],
  initialRealizations = [],
  initialReferences = [],
  initialTemplates = [],
  initialSelectedSettings = {},
  hasUnsavedChanges = false,
  onSetGuardedAction,
  onUpdateSelected,
  onUpdateSettings,
}) => {
  const dingoConcept = createDingoConcept({
    aliases: initialAliases,
    media: initialMedia,
    realizations: initialRealizations,
    references: initialReferences,
  })

  const conceptMap = {
    root: rootConcept,
    object: objectConcept,
    dingo: dingoConcept,
  }

  const mockGetConcept = vi.fn(name => conceptMap[name] || null)
  const mockTaxonomy = createMockTaxonomy(conceptMap)
  const mockTaxonomyValue = createMockTaxonomyValue(mockTaxonomy, mockGetConcept)

  const [concept, setConcept] = useState(dingoConcept)
  const initialState = useMemo(
    () => (concept ? initialConceptState({ ...concept, templates: [] }, []) : null),
    [concept]
  )
  const [stagedState, dispatch] = useReducer(conceptStateReducer, {})
  const [confirmReset, setConfirmReset] = useState(null)
  const [isEditing, setEditing] = useState(false)
  const [selectedSettings, setSelectedSettings] = useState(initialSelectedSettings)

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

  const mockGetSelected = useCallback(
    key => {
      if (key === 'concept') return concept?.name
      return 'Concepts'
    },
    [concept]
  )

  const mockUpdateSelected = useCallback(
    update => {
      onUpdateSelected?.(update)

      const { concept: conceptName } = update || {}
      if (conceptName) {
        const newConcept = mockGetConcept(conceptName)
        if (newConcept) setConcept(newConcept)
      }
    },
    [mockGetConcept, onUpdateSelected]
  )


  const mockGetSettings = useCallback(
    (key, subKey) => {
      if (key == null) {
        return selectedSettings
      }

      const setting = selectedSettings?.[key]
      if (subKey == null) {
        return setting
      }

      return setting?.[subKey]
    },
    [selectedSettings]
  )

  const mockSetSettings = useCallback(setting => {
    setSelectedSettings(setting || {})
  }, [])

  const mockUpdateSettings = useCallback(
    update => {
      onUpdateSettings?.(update)
      setSelectedSettings(current => mergeSettings(current, update))
    },
    [onUpdateSettings]
  )

  const mockSelectedValue = {
    concepts: mockConceptSelect,
    panels: mockPanelSelect,
    getSelected: mockGetSelected,
    updateSelected: mockUpdateSelected,
    settings: selectedSettings,
    getSettings: mockGetSettings,
    setSettings: mockSetSettings,
    updateSettings: mockUpdateSettings,
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
    templates: initialTemplates,
    getConceptTemplates: vi.fn(conceptName =>
      conceptName ? initialTemplates.filter(template => template.concept === conceptName) : initialTemplates
    ),
    getReferences: vi.fn(conceptName => (conceptName === concept?.name ? initialReferences : [])),
    refreshData: vi.fn(),
    isLoading: false,
  }

  const mockUserValue = {
    user: { role: 'Admin' },
    hasUnsavedChanges,
    setGuardedAction: onSetGuardedAction || vi.fn(),
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

export const enterEditMode = async (user, screen) => {
  const editButton = screen.getByRole('button', { name: 'Edit' })
  await user.click(editButton)
}

export const clickAddMediaButton = async (user, screen) => {
  const addMediaButton = screen.getByRole('button', { name: /add media/i })
  await user.click(addMediaButton)
}

export const clickEditMediaButton = async (user, screen) => {
  const editMediaButton = screen.getByRole('button', { name: /edit media/i })
  await user.click(editMediaButton)
}

export const clickDeleteMediaButton = async (user, screen) => {
  const deleteMediaButton = screen.getByRole('button', { name: /delete media/i })
  await user.click(deleteMediaButton)
}

export const fillMediaForm = async (user, screen, { url, credit, caption }) => {
  if (url !== undefined) {
    const urlInput = screen.getByRole('textbox', { name: /url/i })
    await user.clear(urlInput)
    await user.type(urlInput, url)
  }

  if (credit !== undefined) {
    const creditInput = screen.getByRole('textbox', { name: /credit/i })
    await user.clear(creditInput)
    await user.type(creditInput, credit)
  }

  if (caption !== undefined) {
    const captionInput = screen.getByRole('textbox', { name: /caption/i })
    await user.clear(captionInput)
    if (caption !== '') {
      await user.type(captionInput, caption)
    }
  }
}

export const togglePrimaryCheckbox = async (user, screen) => {
  const primaryCheckbox = screen.getByRole('checkbox', { name: /primary/i })
  await user.click(primaryCheckbox)
}

export const clickStageButton = async (user, screen) => {
  const stageButton = screen.getByRole('button', { name: 'Stage' })
  await user.click(stageButton)
}

export const clickDiscardButton = async (user, screen) => {
  const discardButton = screen.getByRole('button', { name: 'Discard' })
  await user.click(discardButton)
}

export const clickDiscardAllButton = async (user, screen) => {
  const discardAllButton = screen.getByRole('button', { name: 'Discard All' })
  await user.click(discardAllButton)
}

export const confirmDiscard = async (user, screen) => {
  const confirmDiscardButton = screen.getByRole('button', { name: 'Discard' })
  await user.click(confirmDiscardButton)
}

export default ConceptPanelTestWrapper
