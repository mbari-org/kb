import { renderHook, act } from '@testing-library/react'
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

import useSaveStaged from '@/contexts/panels/concepts/staged/save/useSaveStaged'

import { getConcept as apiGetConcept } from '@/lib/api/concept'
import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const applyRenameSideEffectsMock = vi.fn()
const applyUpdateResultsMock = vi.fn()
const normalizeConceptMock = vi.fn()
const submitStagedMock = vi.fn()

vi.mock('@/lib/api/concept', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    normalizeConcept: (...args) => normalizeConceptMock(...args),
  }
})

vi.mock('@/contexts/panels/concepts/staged/save/applyRenameSideEffects', () => ({
  default: (...args) => applyRenameSideEffectsMock(...args),
}))

vi.mock('@/contexts/panels/concepts/staged/save/applyUpdateResults', () => ({
  default: (...args) => applyUpdateResultsMock(...args),
}))

vi.mock('@/contexts/panels/concepts/staged/save/submitStaged', () => ({
  default: (...args) => submitStagedMock(...args),
}))

describe('useSaveStaged', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const buildRenameHarness = ({ isUpdatedField, withMedia = true }) => {
    const staleConcept = {
      alternateNames: [],
      children: [],
      name: 'old-concept',
      parent: 'root',
      realizations: [],
      templates: [],
      ...(withMedia ? { media: [] } : {}),
    }
    const fetchedConcept = { name: 'renamed-concept', media: [], realizations: [] }
    const updatedConcept = { name: 'renamed-concept', parent: 'root' }
    const updatesInfo = {
      hasUpdated: isUpdatedField,
      results: [],
      updatedValue: field => {
        if (field === CONCEPT.FIELD.NAME) {
          return { value: 'renamed-concept' }
        }
        return undefined
      },
    }

    const apiFns = {
      apiPayload: vi.fn(async (fn, conceptName) => {
        if (fn === apiGetConcept) {
          return fetchedConcept
        }
        throw new Error(`Unexpected api function: ${fn?.name || 'unknown'} ${conceptName || ''}`)
      }),
    }
    const closeModal = vi.fn()
    const conceptEditsRefresh = vi.fn(async () => ({ concept: updatedConcept }))
    const pendingHistory = [{ concept: 'renamed-concept', field: 'ConceptName', id: 'pending-1' }]
    const refreshData = vi.fn(async () => ({ pendingHistory }))
    const relabelConceptPaths = vi.fn()
    const resetConceptPaths = vi.fn()
    const setConcept = vi.fn(async () => {})
    const setEditing = vi.fn()
    const updateSelected = vi.fn()
    const withProcessing = vi.fn(async work => work())

    const order = []
    submitStagedMock.mockImplementation(async () => {
      order.push('submitStaged')
      return updatesInfo
    })
    applyRenameSideEffectsMock.mockImplementation(async () => {
      order.push('applyRenameSideEffects')
      return undefined
    })
    normalizeConceptMock.mockImplementation(async () => {
      order.push('normalizeConcept')
      return fetchedConcept
    })
    applyUpdateResultsMock.mockImplementation(async () => {
      order.push('applyUpdateResults')
      return undefined
    })

    const wrapper = ({ children }) => (
      <UserContext.Provider value={{ getPreferences: vi.fn(), isAdmin: true, user: { role: 'Admin' } }}>
        <ConfigContext.Provider value={{ apiFns }}>
          <PanelDataContext.Provider
            value={{ getReferences: vi.fn(), refreshData, reloadConceptRealizations: vi.fn(async () => []) }}
          >
            <PreferencesContext.Provider value={{ savePreferences: vi.fn() }}>
              <SelectedContext.Provider value={{ updateSelected }}>
                <SelectedSettingsContext.Provider value={{ getSettings: vi.fn(() => ({})) }}>
                  <TaxonomyContext.Provider value={{ conceptEditsRefresh }}>
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
                        <ConceptStagedContext.Provider value={{ stagedState: {} }}>
                          {children}
                        </ConceptStagedContext.Provider>
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
      fetchedConcept,
      order,
      pendingHistory,
      refreshData,
      relabelConceptPaths,
      resetConceptPaths,
      setConcept,
      setEditing,
      staleConcept,
      updateSelected,
      updatedConcept,
      updatesInfo,
      withProcessing,
      wrapper,
    }
  }

  it('relabels client state after a pure rename without refetching the concept', async () => {
    const harness = buildRenameHarness({ isUpdatedField: field => field === CONCEPT.FIELD.NAME })

    const { result } = renderHook(() => useSaveStaged(), { wrapper: harness.wrapper })
    await act(async () => {
      await result.current()
    })

    const expectedFreshConcept = { alternateNames: [], children: [], media: [], name: 'renamed-concept', parent: 'root' }

    expect(harness.order).toEqual(['submitStaged', 'applyRenameSideEffects', 'applyUpdateResults'])
    expect(harness.apiFns.apiPayload).not.toHaveBeenCalled()
    expect(normalizeConceptMock).not.toHaveBeenCalled()
    expect(harness.relabelConceptPaths).toHaveBeenCalledWith('old-concept', 'renamed-concept')
    expect(harness.resetConceptPaths).not.toHaveBeenCalled()
    expect(applyUpdateResultsMock).toHaveBeenCalledWith({
      freshConcept: expectedFreshConcept,
      isAdmin: true,
      staleConcept: harness.staleConcept,
      updatesInfo: harness.updatesInfo,
    })
    expect(harness.conceptEditsRefresh).toHaveBeenCalledWith(expectedFreshConcept, harness.staleConcept, {})
    expect(harness.refreshData).toHaveBeenCalledWith('pendingHistory')
    expect(harness.setConcept).toHaveBeenCalledWith(harness.updatedConcept, harness.pendingHistory)
    expect(harness.setEditing).toHaveBeenCalledWith(false)
    expect(harness.updateSelected).toHaveBeenCalledWith({ concept: 'renamed-concept' })
    expect(harness.closeModal).toHaveBeenCalled()
    expect(harness.withProcessing).toHaveBeenCalledTimes(1)
  })

  it('fetches only media after a pure rename when the concept media is not yet loaded', async () => {
    const harness = buildRenameHarness({ isUpdatedField: field => field === CONCEPT.FIELD.NAME, withMedia: false })

    const { result } = renderHook(() => useSaveStaged(), { wrapper: harness.wrapper })
    await act(async () => {
      await result.current()
    })

    expect(harness.apiFns.apiPayload).not.toHaveBeenCalled()
    expect(normalizeConceptMock).toHaveBeenCalledWith(harness.apiFns, {
      alternateNames: [],
      children: [],
      name: 'renamed-concept',
      parent: 'root',
    })
  })

  it('refetches the concept when the rename is staged with other field updates', async () => {
    const harness = buildRenameHarness({
      isUpdatedField: field => field === CONCEPT.FIELD.NAME || field === CONCEPT.FIELD.RANK,
    })

    const { result } = renderHook(() => useSaveStaged(), { wrapper: harness.wrapper })
    await act(async () => {
      await result.current()
    })

    expect(harness.order).toEqual(['submitStaged', 'applyRenameSideEffects', 'normalizeConcept', 'applyUpdateResults'])
    expect(harness.apiFns.apiPayload).toHaveBeenCalledWith(apiGetConcept, 'renamed-concept')
    expect(normalizeConceptMock).toHaveBeenCalledWith(harness.apiFns, harness.fetchedConcept)
    expect(harness.relabelConceptPaths).toHaveBeenCalledWith('old-concept', 'renamed-concept')
    expect(harness.resetConceptPaths).not.toHaveBeenCalled()
    expect(harness.conceptEditsRefresh).toHaveBeenCalledWith(harness.fetchedConcept, harness.staleConcept, {})
  })

  it('resets concept paths instead of relabeling when the parent changes alongside the name', async () => {
    const harness = buildRenameHarness({
      isUpdatedField: field => field === CONCEPT.FIELD.NAME || field === CONCEPT.FIELD.PARENT,
    })

    const { result } = renderHook(() => useSaveStaged(), { wrapper: harness.wrapper })
    await act(async () => {
      await result.current()
    })

    expect(harness.resetConceptPaths).toHaveBeenCalledTimes(1)
    expect(harness.relabelConceptPaths).not.toHaveBeenCalled()
    expect(harness.apiFns.apiPayload).toHaveBeenCalledWith(apiGetConcept, 'renamed-concept')
  })

  it('passes created child payloads from submit results to conceptEditsRefresh', async () => {
    const harness = buildRenameHarness({ isUpdatedField: () => false })
    const childPayload = { alternateNames: [], id: 42, media: [], name: 'created-child' }
    harness.updatesInfo.results = [
      { action: CONCEPT_STATE.CHILD.ADD, field: CONCEPT.FIELD.CHILDREN, response: childPayload },
      { action: CONCEPT_STATE.MEDIA_ITEM.ADD, field: CONCEPT.FIELD.MEDIA, response: { id: 7 } },
    ]

    const { result } = renderHook(() => useSaveStaged(), { wrapper: harness.wrapper })
    await act(async () => {
      await result.current()
    })

    expect(harness.conceptEditsRefresh).toHaveBeenCalledWith(harness.fetchedConcept, harness.staleConcept, {
      'created-child': childPayload,
    })
  })

  const buildRealizationSaveHarness = ({ realizationsUpdated = true } = {}) => {
    const staleConcept = { name: 'some-concept' }
    const freshConcept = { name: 'some-concept', media: [], realizations: [] }
    const updatedConcept = { name: 'some-concept', parent: 'root' }
    const updatesInfo = {
      hasUpdated: field => realizationsUpdated && field === CONCEPT.FIELD.REALIZATIONS,
      results: [],
      updatedValue: () => undefined,
    }

    const apiFns = {
      apiPayload: vi.fn(async fn => {
        if (fn === apiGetConcept) {
          return freshConcept
        }
        throw new Error(`Unexpected api function: ${fn?.name || 'unknown'}`)
      }),
    }
    const refreshData = vi.fn(async () => ({ pendingHistory: [] }))
    const reloadConceptRealizations = vi.fn(async () => [])

    submitStagedMock.mockImplementation(async () => updatesInfo)
    applyUpdateResultsMock.mockImplementation(async () => undefined)
    normalizeConceptMock.mockImplementation(async () => freshConcept)

    const wrapper = ({ children }) => (
      <UserContext.Provider value={{ getPreferences: vi.fn(), isAdmin: true, user: { role: 'Admin' } }}>
        <ConfigContext.Provider value={{ apiFns }}>
          <PanelDataContext.Provider
            value={{ getReferences: vi.fn(), refreshData, reloadConceptRealizations }}
          >
            <PreferencesContext.Provider value={{ savePreferences: vi.fn() }}>
              <SelectedContext.Provider value={{ updateSelected: vi.fn() }}>
                <SelectedSettingsContext.Provider value={{ getSettings: vi.fn(() => ({})) }}>
                  <TaxonomyContext.Provider
                    value={{ conceptEditsRefresh: vi.fn(async () => ({ concept: updatedConcept })) }}
                  >
                    <ConceptModalContext.Provider value={{ closeModal: vi.fn(), withProcessing: vi.fn(async work => work()) }}>
                      <ConceptContext.Provider
                        value={{ concept: staleConcept, initialState: {}, setConcept: vi.fn(async () => {}), setEditing: vi.fn() }}
                      >
                        <ConceptStagedContext.Provider value={{ stagedState: {} }}>
                          {children}
                        </ConceptStagedContext.Provider>
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

    return { refreshData, reloadConceptRealizations, wrapper }
  }

  it('reloads the saved concept realizations after staged realizations are saved', async () => {
    const { refreshData, reloadConceptRealizations, wrapper } = buildRealizationSaveHarness()

    const { result } = renderHook(() => useSaveStaged(), { wrapper })
    await act(async () => {
      await result.current()
    })

    expect(reloadConceptRealizations).toHaveBeenCalledWith('some-concept')
    expect(refreshData).toHaveBeenCalledWith('pendingHistory')
  })

  it('does not reload realizations when no realization update was staged', async () => {
    const { refreshData, reloadConceptRealizations, wrapper } = buildRealizationSaveHarness({
      realizationsUpdated: false,
    })

    const { result } = renderHook(() => useSaveStaged(), { wrapper })
    await act(async () => {
      await result.current()
    })

    expect(reloadConceptRealizations).not.toHaveBeenCalled()
    expect(refreshData).toHaveBeenCalledWith('pendingHistory')
  })
})
