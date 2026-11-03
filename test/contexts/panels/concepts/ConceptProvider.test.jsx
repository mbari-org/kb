import { use } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConceptProvider from '@/contexts/panels/concepts/ConceptProvider'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'
import { SELECTED } from '@/lib/constants/selected.js'
import { getConceptPhylogenyUp } from '@/lib/api/concept'

const { showBoundaryMock } = vi.hoisted(() => ({
  showBoundaryMock: vi.fn(),
}))

vi.mock('react-error-boundary', () => ({
  useErrorBoundary: () => ({
    showBoundary: showBoundaryMock,
  }),
}))

const concept = {
  aliases: [],
  alternateNames: [],
  children: [],
  media: [],
  name: 'dingo',
  parent: 'root',
  rankLevel: '',
  rankName: '',
  realizations: [],
  references: [],
  templates: [],
}

const ConceptProbe = () => {
  const value = use(ConceptContext)
  return <div data-testid='concept-name'>{value.concept?.name || ''}</div>
}

const renderProvider = ({ apiPayload, selectedName = 'dingo', taxonomyValue }) => {
  const beginProcessing = vi.fn(() => vi.fn())
  const ensureConceptRealizations = vi.fn(async () => [])
  const getConceptTemplates = vi.fn(() => [])
  const setHasUnsavedChanges = vi.fn()
  const updateSelected = vi.fn()

  const defaultTaxonomyValue = {
    getConcept: name => (name === 'dingo' ? concept : null),
    getConceptPrimaryName: name => (name === 'dingo' ? 'dingo' : undefined),
    isConceptLoaded: name => name === 'dingo',
    loadConcept: vi.fn(async () => concept),
    taxonomy: { rootName: 'root' },
  }

  render(
    <AppModalContext.Provider value={{ beginProcessing }}>
      <ConfigContext.Provider value={{ apiFns: { apiPayload }, phylogenyRoot: 'root' }}>
        <ConceptModalContext.Provider value={{ setModal: vi.fn(), setModalData: vi.fn() }}>
          <PanelDataContext.Provider
            value={{
              ensureConceptRealizations,
              getConceptTemplates,
              pendingHistory: [],
              realizationsByConcept: {},
            }}
          >
            <SelectedContext.Provider
              value={{
                concepts: { clear: vi.fn(), getState: vi.fn(() => [selectedName]), push: vi.fn() },
                getSelected: key => (key === SELECTED.CONCEPT ? selectedName : null),
                panels: { current: () => SELECTED.PANELS.CONCEPTS },
                updateSelected,
              }}
            >
              <TaxonomyContext.Provider value={taxonomyValue || defaultTaxonomyValue}>
                <UserContext.Provider value={{ guardedAction: null, setHasUnsavedChanges }}>
                  <ConceptProvider>
                    <ConceptProbe />
                  </ConceptProvider>
                </UserContext.Provider>
              </TaxonomyContext.Provider>
            </SelectedContext.Provider>
          </PanelDataContext.Provider>
        </ConceptModalContext.Provider>
      </ConfigContext.Provider>
    </AppModalContext.Provider>
  )

  return { beginProcessing, ensureConceptRealizations, updateSelected }
}

const phylogenyUpPayload = { name: 'root', children: [{ name: 'dingo' }] }

describe('ConceptProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('routes concept-path fetch failures to the error boundary', async () => {
    const pathError = new Error('concept path failed')
    const apiPayload = vi.fn(async (fn, conceptName) => {
      if (fn === getConceptPhylogenyUp && conceptName === 'dingo') {
        throw pathError
      }
      return {}
    })

    renderProvider({ apiPayload })

    await waitFor(() => {
      expect(showBoundaryMock).toHaveBeenCalledWith(pathError)
    })
  })

  it('converges an alias selection to the primary name after the concept loads', async () => {
    const aliasedConcept = { ...concept, alternateNames: ['doggo'] }
    let aliasRegistered = false

    const getConcept = name => {
      if (name === 'dingo') return aliasedConcept
      if (name === 'doggo' && aliasRegistered) return aliasedConcept
      return null
    }

    const taxonomyValue = {
      getConcept,
      getConceptPrimaryName: name => getConcept(name)?.name,
      isConceptLoaded: name => aliasRegistered && Boolean(getConcept(name)),
      loadConcept: vi.fn(async () => {
        aliasRegistered = true
        return aliasedConcept
      }),
      taxonomy: { rootName: 'root' },
    }

    const apiPayload = vi.fn(async () => phylogenyUpPayload)

    const { ensureConceptRealizations, updateSelected } = renderProvider({
      apiPayload,
      selectedName: 'doggo',
      taxonomyValue,
    })

    await waitFor(() => {
      expect(updateSelected).toHaveBeenCalledWith({ concept: 'dingo' })
    })

    expect(updateSelected).not.toHaveBeenCalledWith({ concept: 'doggo' })
    expect(ensureConceptRealizations).toHaveBeenCalledTimes(1)
  })
})
