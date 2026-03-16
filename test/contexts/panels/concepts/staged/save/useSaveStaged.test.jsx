import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import PreferencesContext from '@/contexts/preferences/PreferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import useSaveStaged from '@/contexts/panels/concepts/staged/save/useSaveStaged'

import { getConcept as apiGetConcept } from '@/lib/api/concept'
import { CONCEPT } from '@/lib/constants'

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
  it('orchestrates concept refresh and taxonomy update after a staged save', async () => {
    const staleConcept = { name: 'old-concept' }
    const freshConcept = { name: 'renamed-concept', media: [], realizations: [] }
    const updatedConcept = { name: 'renamed-concept', parent: 'root' }
    const updatesInfo = {
      hasUpdated: field => field === CONCEPT.FIELD.NAME,
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
          return freshConcept
        }
        throw new Error(`Unexpected api function: ${fn?.name || 'unknown'} ${conceptName || ''}`)
      }),
    }
    const closeModal = vi.fn()
    const conceptEditsRefresh = vi.fn(async () => ({ concept: updatedConcept }))
    const setConcept = vi.fn(async () => {})
    const setEditing = vi.fn()
    const updateSelected = vi.fn()
    const withProcessing = vi.fn(async work => work())

    submitStagedMock.mockResolvedValue(updatesInfo)
    normalizeConceptMock.mockResolvedValue(freshConcept)
    applyUpdateResultsMock.mockResolvedValue(undefined)
    applyRenameSideEffectsMock.mockResolvedValue(undefined)

    const wrapper = ({ children }) => (
      <UserContext.Provider value={{ getPreferences: vi.fn(), user: { role: 'Admin' } }}>
        <ConfigContext.Provider value={{ apiFns }}>
          <PanelDataContext.Provider value={{ getReferences: vi.fn(), refreshData: vi.fn() }}>
            <PreferencesContext.Provider value={{ savePreferences: vi.fn() }}>
              <SelectedContext.Provider value={{ getSettings: vi.fn(() => ({})), updateSelected }}>
                <TaxonomyContext.Provider value={{ conceptEditsRefresh }}>
                  <ConceptModalContext.Provider value={{ closeModal, withProcessing }}>
                    <ConceptContext.Provider
                      value={{ concept: staleConcept, initialState: {}, setConcept, setEditing, stagedState: {} }}
                    >
                      {children}
                    </ConceptContext.Provider>
                  </ConceptModalContext.Provider>
                </TaxonomyContext.Provider>
              </SelectedContext.Provider>
            </PreferencesContext.Provider>
          </PanelDataContext.Provider>
        </ConfigContext.Provider>
      </UserContext.Provider>
    )

    const { result } = renderHook(() => useSaveStaged(), { wrapper })

    await act(async () => {
      await result.current()
    })

    expect(submitStagedMock).toHaveBeenCalledTimes(1)
    expect(apiFns.apiPayload).toHaveBeenCalledWith(apiGetConcept, 'renamed-concept')
    expect(normalizeConceptMock).toHaveBeenCalledWith(apiFns, freshConcept)
    expect(applyUpdateResultsMock).toHaveBeenCalledWith({
      freshConcept,
      isAdmin: true,
      staleConcept,
      updatesInfo,
    })
    expect(applyRenameSideEffectsMock).toHaveBeenCalledWith(
      expect.objectContaining({ apiFns, staleConcept, user: { role: 'Admin' } }),
      updatesInfo
    )
    expect(conceptEditsRefresh).toHaveBeenCalledWith(freshConcept, staleConcept)
    expect(setConcept).toHaveBeenCalledWith(updatedConcept)
    expect(setEditing).toHaveBeenCalledWith(false)
    expect(updateSelected).toHaveBeenCalledWith({ concept: 'renamed-concept' })
    expect(closeModal).toHaveBeenCalled()
    expect(withProcessing).toHaveBeenCalledTimes(1)
  })
})
