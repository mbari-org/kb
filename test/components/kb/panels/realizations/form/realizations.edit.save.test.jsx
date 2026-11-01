import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from 'react-error-boundary'

import useEditRealizationButton from '@/components/kb/panels/realizations/form/useEditRealizationButton'
import useModifyRealizations from '@/contexts/panels/realizations/useModifyRealizations'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import TaxonomyProvider from '@/contexts/taxonomy/TaxonomyProvider'
import UserContext from '@/contexts/user/UserContext'
import { PanelModalProvider } from '@/contexts/panel/modal'
import {
  RealizationsModalProvider,
  useRealizationsModalOperationsContext,
} from '@/contexts/panels/realizations/modal'

import {
  getConcept as apiConcept,
  getConceptChildren as apiChildren,
  getConceptNames as apiConceptNames,
  getConceptParent as apiParent,
} from '@/lib/api/concept'
import { getMedia } from '@/lib/api/media'
import { getConceptLinkRealizations, updateRealization } from '@/lib/api/realizations'
import { getNames as apiNames, getRanks as apiRanks, getRoot as apiRoot } from '@/lib/api/taxonomy'

const ROW = { id: 1, concept: 'target-child', linkName: 'eats', toConcept: 'nil', linkValue: 'fish' }
const TEMPLATE = { id: 't1', concept: 'old-parent', linkName: 'eats', toConcept: 'nil', linkValue: 'fish' }

const createConceptRecord = ({ alternateNames = [], children, name, parent }) => {
  const concept = { alternateNames, media: [], name, parent, realizations: [], references: [], templates: [] }
  if (children !== undefined) {
    concept.children = children
  }
  return concept
}

const createStore = () => ({
  children: {
    root: ['old-parent'],
    'old-parent': ['moving-child'],
    'moving-child': ['target-child'],
    'target-child': [],
  },
  concepts: {
    root: createConceptRecord({ name: 'root', parent: undefined }),
    'old-parent': createConceptRecord({ name: 'old-parent', parent: 'root' }),
    'moving-child': createConceptRecord({ name: 'moving-child', parent: 'old-parent' }),
    'target-child': createConceptRecord({ name: 'target-child', parent: 'moving-child' }),
  },
  ranks: [],
})

const cloneConcept = concept => ({
  ...concept,
  alternateNames: [...(concept.alternateNames || [])],
  children: concept.children ? [...concept.children] : concept.children,
})

const createApiFns = store => ({
  apiPayload: vi.fn(async (fn, value) => {
    if (fn === apiRoot) return { name: 'root' }
    if (fn === apiNames) return Object.keys(store.concepts).sort()
    if (fn === apiRanks) return []
    if (fn === apiConcept) return cloneConcept(store.concepts[value])
    if (fn === apiChildren) return (store.children[value] || []).map(childName => cloneConcept(store.concepts[childName]))
    if (fn === apiConceptNames) return []
    if (fn === apiParent) return { name: store.concepts[value]?.parent }
    if (fn === getMedia) return []
    if (fn === getConceptLinkRealizations) return []
    if (fn === updateRealization) return {}
    throw new Error(`Unexpected api payload function: ${fn?.name || 'unknown'}`)
  }),
})

const ModifyBridge = ({ children }) => {
  const modify = useModifyRealizations()
  return children(modify)
}

const Harness = () => {
  const editRealizationModal = useEditRealizationButton()
  const { modal, processing } = useRealizationsModalOperationsContext()

  return (
    <>
      <button onClick={() => editRealizationModal(ROW)} type='button'>
        edit
      </button>
      {!processing && modal && modal()}
    </>
  )
}

describe('Realizations panel edit save', () => {
  let apiFns
  let errors
  let refreshData
  let reloadConceptRealizations

  beforeEach(() => {
    vi.clearAllMocks()
    errors = []
    apiFns = createApiFns(createStore())
    refreshData = vi.fn(async () => ({ realizations: [ROW] }))
    reloadConceptRealizations = vi.fn(async () => [ROW])
  })

  const renderPanel = () =>
    render(
      <ErrorBoundary fallbackRender={() => null} onError={error => errors.push(error)}>
        <UserContext.Provider value={{ isAdmin: true, user: { role: 'Admin' } }}>
          <ConfigContext.Provider value={{ apiFns }}>
            <TaxonomyProvider>
              <PanelModalProvider>
                <PanelDataContext.Provider
                  value={{
                    getConceptRealizations: vi.fn(() => [ROW]),
                    isLoading: false,
                    pendingHistory: [],
                    refreshData,
                    reloadConceptRealizations,
                    templates: [TEMPLATE],
                  }}
                >
                  <ConceptContext.Provider value={{ concept: null }}>
                    <ModifyBridge>
                      {({ editRealization }) => (
                        <RealizationsContext.Provider value={{ editRealization }}>
                          <RealizationsModalProvider>
                            <Harness />
                          </RealizationsModalProvider>
                        </RealizationsContext.Provider>
                      )}
                    </ModifyBridge>
                  </ConceptContext.Provider>
                </PanelDataContext.Provider>
              </PanelModalProvider>
            </TaxonomyProvider>
          </ConfigContext.Provider>
        </UserContext.Provider>
      </ErrorBoundary>
    )

  it('dismisses the edit modal after a successful save', async () => {
    const user = userEvent.setup()
    renderPanel()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'edit' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'edit' }))

    const linkValueInput = await screen.findByRole('textbox', { name: 'Link Value' })
    await waitFor(() => {
      expect(linkValueInput).toBeEnabled()
    })

    await user.clear(linkValueInput)
    await user.type(linkValueInput, 'squid')

    await user.click(screen.getByRole('button', { name: 'Save' }))
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(screen.queryByText('Concept: target-child')).not.toBeInTheDocument()
    })

    expect(apiFns.apiPayload).toHaveBeenCalledWith(updateRealization, [1, { linkValue: 'squid' }])
    expect(errors).toEqual([])
  })
})
