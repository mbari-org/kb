import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import PreferencesContext from '@/contexts/preferences/PreferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import useReloadConcept from '@/contexts/panels/concepts/staged/save/useReloadConcept'

import { getConceptById, getConceptChildren, getConceptNameById, getConceptParent } from '@/lib/api/concept'
import CONFIG from '@/lib/config'

const { PROCESSING } = CONFIG

const remapConceptNameMock = vi.fn()
const normalizeConceptMock = vi.fn()

vi.mock('@/lib/api/concept', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    normalizeConcept: (...args) => normalizeConceptMock(...args),
  }
})

vi.mock('@/contexts/panels/concepts/staged/save/remapConceptName', () => ({
  default: (...args) => remapConceptNameMock(...args),
}))

const serverRoutes = ({ name, parent, children }) =>
  new Map([
    [
      getConceptById,
      () => ({ id: 42, name, rankLevel: 'Species', rankName: 'Species', alternateNames: [], author: '' }),
    ],
    [getConceptNameById, () => ({ id: 42, names: [{ id: 7, name, nameType: 'Primary', author: 'Smith' }] })],
    [getConceptChildren, () => children.map(child => ({ id: 9, name: child }))],
    [getConceptParent, () => ({ name: parent })],
  ])

const buildHarness = ({ isRootConcept = false, server = {} } = {}) => {
  const staleConcept = {
    aliases: [],
    alternateNames: [],
    children: ['pup'],
    id: 42,
    media: [],
    name: 'dingo',
    parent: isRootConcept ? undefined : 'root',
    primaryNameId: 7,
  }
  const routes = serverRoutes({ name: 'dingo', parent: 'root', children: ['pup'], ...server })

  normalizeConceptMock.mockImplementation(async (_apiFns, concept) => ({ ...concept, media: [] }))
  remapConceptNameMock.mockImplementation(async () => undefined)

  const apiFns = {
    apiPayload: vi.fn(async (fn, param) => routes.get(fn)(param)),
  }
  const pendingHistory = [{ concept: 'dingo', id: 'pending-1' }]
  const refreshData = vi.fn(async () => ({ pendingHistory }))
  const reloadConceptRealizations = vi.fn(async () => [])
  const conceptEditsRefresh = vi.fn(async freshConcept => ({ concept: freshConcept }))
  const closeModal = vi.fn()
  const relabelConceptPaths = vi.fn()
  const resetConceptPaths = vi.fn()
  const setConcept = vi.fn(async () => {})
  const setEditing = vi.fn()
  const updateSelected = vi.fn()
  const withProcessing = vi.fn(async work => work())

  const wrapper = ({ children }) => (
    <UserContext.Provider value={{ getPreferences: vi.fn(), isAdmin: true, user: { role: 'Admin' } }}>
      <ConfigContext.Provider value={{ apiFns }}>
        <PanelDataContext.Provider
          value={{
            getReferences: vi.fn(),
            refreshData,
            renameConceptRealizations: vi.fn(),
            renameRealizationToConceptNames: vi.fn(),
            reloadConceptRealizations,
          }}
        >
          <PreferencesContext.Provider value={{ savePreferences: vi.fn(), updatePreferences: vi.fn() }}>
            <SelectedContext.Provider value={{ updateSelected }}>
              <SelectedSettingsContext.Provider value={{ getSettings: vi.fn(() => ({})), settings: {} }}>
                <TaxonomyContext.Provider value={{ conceptEditsRefresh, isRoot: () => isRootConcept }}>
                  <ConceptModalContext.Provider value={{ closeModal, withProcessing }}>
                    <ConceptContext.Provider
                      value={{
                        concept: staleConcept,
                        initialState: {},
                        relabelConceptPaths,
                        resetConceptPaths,
                        setConcept,
                        setEditing,
                      }}
                    >
                      <ConceptStagedContext.Provider value={{ stagedState: {} }}>{children}</ConceptStagedContext.Provider>
                    </ConceptContext.Provider>
                  </ConceptModalContext.Provider>
                </TaxonomyContext.Provider>
              </SelectedSettingsContext.Provider>
            </SelectedContext.Provider>
          </PreferencesContext.Provider>
        </PanelDataContext.Provider>
      </ConfigContext.Provider>
    </UserContext.Provider>
  )

  return {
    apiFns,
    closeModal,
    conceptEditsRefresh,
    pendingHistory,
    refreshData,
    relabelConceptPaths,
    reloadConceptRealizations,
    resetConceptPaths,
    setConcept,
    setEditing,
    staleConcept,
    updateSelected,
    withProcessing,
    wrapper,
  }
}

describe('useReloadConcept', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reloads the concept by id and replaces the concept state with the server state', async () => {
    const harness = buildHarness()

    const { result } = renderHook(() => useReloadConcept(), { wrapper: harness.wrapper })
    await act(async () => {
      await result.current()
    })

    expect(harness.withProcessing).toHaveBeenCalledWith(expect.any(Function), PROCESSING.LOAD, PROCESSING.ARG.CONCEPT)
    expect(harness.apiFns.apiPayload).toHaveBeenCalledWith(getConceptById, 42)
    expect(harness.apiFns.apiPayload).toHaveBeenCalledWith(getConceptNameById, 7)
    expect(harness.apiFns.apiPayload).toHaveBeenCalledWith(getConceptChildren, 'dingo')
    expect(harness.apiFns.apiPayload).toHaveBeenCalledWith(getConceptParent, 'dingo')
    expect(remapConceptNameMock).not.toHaveBeenCalled()
    expect(harness.relabelConceptPaths).not.toHaveBeenCalled()
    expect(harness.resetConceptPaths).not.toHaveBeenCalled()
    expect(harness.reloadConceptRealizations).toHaveBeenCalledWith('dingo')
    expect(harness.conceptEditsRefresh).toHaveBeenCalledWith(
      expect.objectContaining({ author: 'Smith', children: ['pup'], id: 42, name: 'dingo', parent: 'root' }),
      harness.staleConcept
    )
    expect(harness.setConcept).toHaveBeenCalledWith(expect.objectContaining({ name: 'dingo' }), harness.pendingHistory)
    expect(harness.setEditing).toHaveBeenCalledWith(false)
    expect(harness.updateSelected).toHaveBeenCalledWith({ concept: 'dingo' })
    expect(harness.closeModal).toHaveBeenCalledWith(true)
  })

  it('remaps client name state and relabels paths when the server holds a new name', async () => {
    const harness = buildHarness({ server: { name: 'wolf' } })

    const { result } = renderHook(() => useReloadConcept(), { wrapper: harness.wrapper })
    await act(async () => {
      await result.current()
    })

    expect(remapConceptNameMock).toHaveBeenCalledWith(
      expect.objectContaining({ staleConcept: harness.staleConcept }),
      'wolf'
    )
    expect(harness.relabelConceptPaths).toHaveBeenCalledWith('dingo', 'wolf')
    expect(harness.resetConceptPaths).not.toHaveBeenCalled()
    expect(harness.reloadConceptRealizations).toHaveBeenCalledWith('wolf')
    expect(harness.setConcept).toHaveBeenCalledWith(expect.objectContaining({ name: 'wolf' }), harness.pendingHistory)
    expect(harness.updateSelected).toHaveBeenCalledWith({ concept: 'wolf' })
  })

  it('resets concept paths instead of relabeling when the server holds a new parent', async () => {
    const harness = buildHarness({ server: { parent: 'other' } })

    const { result } = renderHook(() => useReloadConcept(), { wrapper: harness.wrapper })
    await act(async () => {
      await result.current()
    })

    expect(harness.resetConceptPaths).toHaveBeenCalledTimes(1)
    expect(harness.relabelConceptPaths).not.toHaveBeenCalled()
    expect(harness.conceptEditsRefresh).toHaveBeenCalledWith(
      expect.objectContaining({ parent: 'other' }),
      harness.staleConcept
    )
  })

  it('does not read a parent when reloading the root concept', async () => {
    const harness = buildHarness({ isRootConcept: true, server: { name: 'Animalia', parent: undefined } })

    const { result } = renderHook(() => useReloadConcept(), { wrapper: harness.wrapper })
    await act(async () => {
      await result.current()
    })

    expect(harness.apiFns.apiPayload).not.toHaveBeenCalledWith(getConceptParent, expect.anything())
    expect(harness.conceptEditsRefresh).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Animalia', parent: undefined }),
      harness.staleConcept
    )
  })
})
