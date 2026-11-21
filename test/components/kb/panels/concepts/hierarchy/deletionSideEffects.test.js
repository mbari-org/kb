import { describe, expect, it, vi } from 'vitest'

import {
  postSideEffects,
  preSideEffects,
} from '@/components/kb/panels/concepts/concept/change/staged/name/delete/deletionSideEffects'
import { RELATED_DATA_COUNTS } from '@/components/kb/panels/concepts/concept/change/staged/name/relatedDataCounts'
import { renameToConceptAssociations } from '@/lib/api/associations'
import { renameConceptObservations } from '@/lib/api/observations'
import { createRealization, renameToConceptRealizations } from '@/lib/api/realizations'
import { renameReferenceConcept } from '@/lib/api/references'
import { createConceptTemplate, renameToConceptTemplates } from '@/lib/api/templates'

describe('deletionSideEffects preSideEffects', () => {
  it('recreates explicitly defined realizations on the reassigned concept if not already existing', async () => {
    const createdPayloads = []
    const apiFns = {
      apiWrite: vi.fn(async (apiFn, payload) => {
        if (apiFn === createRealization) {
          createdPayloads.push(payload)
          return { id: 100, ...payload }
        }
        return {}
      }),
    }

    const concept = {
      name: 'OldConcept',
      realizations: [
        { id: 1, concept: 'OldConcept', linkName: 'sample-link', linkValue: 'nil', toConcept: 'TargetConcept' },
        { id: 2, concept: 'OldConcept', linkName: 'self-link', linkValue: 'nil', toConcept: 'OldConcept' },
        { id: 3, concept: 'OldConcept', linkName: 'existing-link', linkValue: 'val', toConcept: 'ReassignedConcept' },
      ],
    }

    const realizationsByConcept = {
      OldConcept: concept.realizations,
      ReassignedConcept: [
        {
          id: 4,
          concept: 'ReassignedConcept',
          linkName: 'existing-link',
          linkValue: 'val',
          toConcept: 'ReassignedConcept',
        },
      ],
    }
    const ensureConceptRealizations = vi.fn(async conceptName => realizationsByConcept[conceptName] ?? [])

    const relatedDataCounts = [{ title: RELATED_DATA_COUNTS.REALIZATIONS, value: 3 }]

    const deleteConceptContext = {
      apiFns,
      concept,
      ensureConceptRealizations,
      reassign: 'ReassignedConcept',
      relatedDataCounts,
      templates: [],
    }

    const results = await preSideEffects(deleteConceptContext)

    expect(ensureConceptRealizations).toHaveBeenCalledWith('ReassignedConcept')
    expect(ensureConceptRealizations).toHaveBeenCalledWith('OldConcept')
    expect(createdPayloads).toEqual([
      { concept: 'ReassignedConcept', linkName: 'sample-link', linkValue: 'nil', toConcept: 'TargetConcept' },
      { concept: 'ReassignedConcept', linkName: 'self-link', linkValue: 'nil', toConcept: 'ReassignedConcept' },
    ])
    expect(results[RELATED_DATA_COUNTS.REALIZATIONS]).toHaveLength(2)
  })
})

const writeFailure = { title: 'Server Error', message: 'boom', details: {}, status: 500 }

describe('deletionSideEffects preSideEffects reassignment writes', () => {
  const reassignmentCases = [
    { title: RELATED_DATA_COUNTS.ANNOTATIONS, apiFn: renameConceptObservations, concept: { name: 'OldConcept' } },
    { title: RELATED_DATA_COUNTS.ASSOCIATIONS, apiFn: renameToConceptAssociations, concept: { name: 'OldConcept' } },
    {
      title: RELATED_DATA_COUNTS.REALIZATIONS,
      apiFn: createRealization,
      concept: { name: 'OldConcept' },
      ensureConceptRealizations: async name =>
        name === 'OldConcept' ? [{ linkName: 'sample-link', linkValue: 'nil', toConcept: 'TargetConcept' }] : [],
    },
    { title: RELATED_DATA_COUNTS.REALIZATIONS_TO, apiFn: renameToConceptRealizations, concept: { name: 'OldConcept' } },
    {
      title: RELATED_DATA_COUNTS.REFERENCES,
      apiFn: renameReferenceConcept,
      concept: { name: 'OldConcept', references: [{ id: 9 }] },
    },
    {
      title: RELATED_DATA_COUNTS.TEMPLATES_DEFINED,
      apiFn: createConceptTemplate,
      concept: { name: 'OldConcept' },
      templates: [{ concept: 'OldConcept', linkName: 'sample-link', linkValue: 'nil', toConcept: 'TargetConcept' }],
    },
    { title: RELATED_DATA_COUNTS.TEMPLATES_TO, apiFn: renameToConceptTemplates, concept: { name: 'OldConcept' } },
  ]

  it.each(reassignmentCases)(
    'routes $title through apiWrite and rejects the flow when the write fails',
    async ({ title, apiFn, concept, ensureConceptRealizations = async () => [], templates = [] }) => {
      const apiFns = {
        apiPayload: vi.fn(),
        apiWrite: vi.fn(async () => {
          throw writeFailure
        }),
      }

      await expect(
        preSideEffects({
          apiFns,
          concept,
          ensureConceptRealizations,
          reassign: 'NewConcept',
          relatedDataCounts: [{ title, value: 1 }],
          templates,
        })
      ).rejects.toMatchObject({ status: 500 })

      expect(apiFns.apiWrite).toHaveBeenCalledWith(apiFn, expect.anything())
      expect(apiFns.apiPayload).not.toHaveBeenCalled()
    }
  )

  it('returns the reassignment result when the write succeeds', async () => {
    const apiFns = { apiPayload: vi.fn(), apiWrite: vi.fn(async () => ({ count: 2 })) }

    const results = await preSideEffects({
      apiFns,
      concept: { name: 'OldConcept' },
      reassign: 'NewConcept',
      relatedDataCounts: [{ title: RELATED_DATA_COUNTS.ASSOCIATIONS, value: 2 }],
      templates: [],
    })

    expect(results[RELATED_DATA_COUNTS.ASSOCIATIONS]).toEqual({ count: 2 })
    expect(apiFns.apiPayload).not.toHaveBeenCalled()
  })
})

describe('deletionSideEffects postSideEffects', () => {
  const buildContext = ({ reassign = null } = {}) => ({
    concept: { name: 'OldConcept' },
    getPreferences: vi.fn(async () => ({ state: ['OldConcept'], position: 0 })),
    invalidateConceptRealizations: vi.fn(),
    reassign,
    refreshPanelData: vi.fn(async () => ({})),
    renameRealizationToConceptNames: vi.fn(),
    savePreferences: vi.fn(async () => ({})),
    settings: {},
    updatePreferences: vi.fn(async () => ({})),
  })

  it('removes the deleted concept key and leaves other keys alone when there is no reassign', async () => {
    const deleteConceptContext = buildContext()

    await postSideEffects(deleteConceptContext)

    expect(deleteConceptContext.updatePreferences).toHaveBeenCalledWith('concepts', { state: [], position: -1 })
    expect(deleteConceptContext.savePreferences).toHaveBeenCalledWith('settings', expect.anything())
    expect(deleteConceptContext.invalidateConceptRealizations).toHaveBeenCalledWith('OldConcept')
    expect(deleteConceptContext.invalidateConceptRealizations).toHaveBeenCalledTimes(1)
    expect(deleteConceptContext.renameRealizationToConceptNames).not.toHaveBeenCalled()
    expect(deleteConceptContext.refreshPanelData).toHaveBeenCalledWith('references')
    expect(deleteConceptContext.refreshPanelData).not.toHaveBeenCalledWith('realizations')
  })

  it('invalidates the reassign target and rewrites toConcept references when reassigning', async () => {
    const deleteConceptContext = buildContext({ reassign: 'ReassignedConcept' })

    await postSideEffects(deleteConceptContext)

    expect(deleteConceptContext.invalidateConceptRealizations).toHaveBeenCalledWith('OldConcept')
    expect(deleteConceptContext.invalidateConceptRealizations).toHaveBeenCalledWith('ReassignedConcept')
    expect(deleteConceptContext.renameRealizationToConceptNames).toHaveBeenCalledWith('OldConcept', 'ReassignedConcept')
    expect(deleteConceptContext.refreshPanelData).toHaveBeenCalledWith('references')
    expect(deleteConceptContext.refreshPanelData).not.toHaveBeenCalledWith('realizations')
  })
})
