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
import { getConceptPath } from '@/lib/api/concept'

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

const renderProvider = ({ apiPayload }) => {
  const beginProcessing = vi.fn(() => vi.fn())
  const getConceptTemplates = vi.fn(() => [])
  const setHasUnsavedChanges = vi.fn()

  render(
    <AppModalContext.Provider value={{ beginProcessing }}>
      <ConfigContext.Provider value={{ apiFns: { apiPayload }, phylogenyRoot: 'root' }}>
        <ConceptModalContext.Provider value={{ setModal: vi.fn(), setModalData: vi.fn() }}>
          <PanelDataContext.Provider value={{ getConceptTemplates, pendingHistory: [] }}>
            <SelectedContext.Provider
              value={{
                concepts: { clear: vi.fn(), getState: vi.fn(() => ['dingo']), push: vi.fn() },
                getSelected: key => (key === SELECTED.CONCEPT ? 'dingo' : null),
                panels: { current: () => SELECTED.PANELS.CONCEPTS },
              }}
            >
              <TaxonomyContext.Provider
                value={{
                  getConcept: name => (name === 'dingo' ? concept : null),
                  isConceptLoaded: name => name === 'dingo',
                  loadConcept: vi.fn(async () => concept),
                  taxonomy: { rootName: 'root' },
                }}
              >
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
}

describe('ConceptProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('routes concept-path fetch failures to the error boundary', async () => {
    const pathError = new Error('concept path failed')
    const apiPayload = vi.fn(async (fn, conceptName) => {
      if (fn === getConceptPath && conceptName === 'dingo') {
        throw pathError
      }
      return {}
    })

    renderProvider({ apiPayload })

    await waitFor(() => {
      expect(showBoundaryMock).toHaveBeenCalledWith(pathError)
    })
  })
})
