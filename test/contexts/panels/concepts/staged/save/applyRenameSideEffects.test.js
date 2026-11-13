import { describe, expect, it, vi, beforeEach } from 'vitest'

import applyRenameSideEffects from '@/contexts/panels/concepts/staged/save/applyRenameSideEffects'

import { CONCEPT } from '@/lib/constants'
import CONFIG from '@/lib/config'

const { REASSIGN, NAME_ONLY } = CONFIG.CONCEPT.CHANGE_NAME

const performReassignmentsMock = vi.fn()

vi.mock('@/components/kb/panels/concepts/concept/change/staged/name/relatedDataCounts', () => ({
  performReassignments: (...args) => performReassignmentsMock(...args),
}))

const buildContext = () => ({
  getPreferences: vi.fn(async () => ({ position: 0, state: ['old-name'] })),
  getSettings: vi.fn(() => ({})),
  refreshPanelData: vi.fn(async () => {}),
  renameConceptRealizations: vi.fn(),
  renameRealizationToConceptNames: vi.fn(),
  savePreferences: vi.fn(async () => {}),
  staleConcept: { name: 'old-name' },
})

const buildUpdatesInfo = ({ extent }) => ({
  updatedValue: field =>
    field === CONCEPT.FIELD.NAME ? { value: 'new-name', extent, relatedDataCounts: [] } : undefined,
})

describe('applyRenameSideEffects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    performReassignmentsMock.mockImplementation(async () => {})
  })

  it('reassigns related data when the extent is reassign', async () => {
    const updatesContext = buildContext()

    await applyRenameSideEffects(updatesContext, buildUpdatesInfo({ extent: REASSIGN }))

    expect(performReassignmentsMock).toHaveBeenCalledWith('old-name', 'new-name', [])
  })

  it('defers reassignments when the extent is name only', async () => {
    const updatesContext = buildContext()

    await applyRenameSideEffects(updatesContext, buildUpdatesInfo({ extent: NAME_ONLY }))

    expect(performReassignmentsMock).not.toHaveBeenCalled()
  })

  it('defers reassignments when no extent was chosen, leaving the choice to the approver', async () => {
    const updatesContext = buildContext()

    await applyRenameSideEffects(updatesContext, buildUpdatesInfo({ extent: '' }))

    expect(performReassignmentsMock).not.toHaveBeenCalled()
  })

  it('always updates local concept name references and preferences', async () => {
    const updatesContext = buildContext()

    await applyRenameSideEffects(updatesContext, buildUpdatesInfo({ extent: NAME_ONLY }))

    expect(updatesContext.renameConceptRealizations).toHaveBeenCalledWith('old-name', 'new-name')
    expect(updatesContext.renameRealizationToConceptNames).toHaveBeenCalledWith('old-name', 'new-name')
    expect(updatesContext.savePreferences).toHaveBeenCalledTimes(2)
    expect(updatesContext.refreshPanelData).toHaveBeenCalledTimes(2)
  })
})
