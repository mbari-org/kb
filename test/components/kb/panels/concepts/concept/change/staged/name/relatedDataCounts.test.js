import { describe, expect, it, vi } from 'vitest'

import {
  hasRelatedData,
  performReassignments,
  relatedDataCounts,
  RELATED_DATA_COUNTS,
} from '@/components/kb/panels/concepts/concept/change/staged/name/relatedDataCounts'

import { getConceptAnnotationsCount } from '@/lib/api/annotations'
import { getToConceptAssociationsCount } from '@/lib/api/associations'
import { getConceptRealizationCount, getToConceptRealizationsCount } from '@/lib/api/realizations'
import { getConceptTemplateCount, getToConceptTemplateCount } from '@/lib/api/templates'

vi.mock('@/lib/api/annotations', () => ({ getConceptAnnotationsCount: vi.fn() }))
vi.mock('@/lib/api/associations', () => ({
  getToConceptAssociationsCount: vi.fn(),
  renameToConceptAssociations: vi.fn(),
}))
vi.mock('@/lib/api/observations', () => ({ renameConceptObservations: vi.fn() }))
vi.mock('@/lib/api/realizations', () => ({
  getConceptRealizationCount: vi.fn(),
  getToConceptRealizationsCount: vi.fn(),
  renameToConceptRealizations: vi.fn(),
}))
vi.mock('@/lib/api/templates', () => ({
  getConceptTemplateCount: vi.fn(),
  getToConceptTemplateCount: vi.fn(),
  renameToConceptTemplates: vi.fn(),
}))

describe('hasRelatedData', () => {
  it('is true when a reassignable count is positive', () => {
    const counts = [
      { title: RELATED_DATA_COUNTS.ANNOTATIONS, value: 2 },
      { title: RELATED_DATA_COUNTS.REALIZATIONS, value: 5 },
    ]

    expect(hasRelatedData(counts)).toBe(true)
  })

  it('ignores realizations for concept and templates defined for concept', () => {
    const counts = [
      { title: RELATED_DATA_COUNTS.REALIZATIONS, value: 5 },
      { title: RELATED_DATA_COUNTS.TEMPLATES_DEFINED, value: 3 },
      { title: RELATED_DATA_COUNTS.REFERENCES, value: 0 },
    ]

    expect(hasRelatedData(counts)).toBe(false)
  })

  it('is false when all counts are zero', () => {
    const counts = [
      { title: RELATED_DATA_COUNTS.ANNOTATIONS, value: 0 },
      { title: RELATED_DATA_COUNTS.REFERENCES, value: 0 },
    ]

    expect(hasRelatedData(counts)).toBe(false)
  })
})

describe('performReassignments', () => {
  it('calls reassignFn for each positive count that has one', async () => {
    const reassignAnnotations = vi.fn(async () => {})
    const reassignTemplates = vi.fn(async () => {})
    const counts = [
      { title: RELATED_DATA_COUNTS.ANNOTATIONS, value: 2, reassignFn: reassignAnnotations },
      { title: RELATED_DATA_COUNTS.REFERENCES, value: 4 },
      { title: RELATED_DATA_COUNTS.TEMPLATES_TO, value: 1, reassignFn: reassignTemplates },
    ]

    await performReassignments('old-name', 'new-name', counts)

    expect(reassignAnnotations).toHaveBeenCalledWith({ old: 'old-name', new: 'new-name' })
    expect(reassignTemplates).toHaveBeenCalledWith({ old: 'old-name', new: 'new-name' })
  })

  it('skips zero counts and counts without a reassignFn', async () => {
    const reassignFn = vi.fn(async () => {})
    const counts = [
      { title: RELATED_DATA_COUNTS.ANNOTATIONS, value: 0, reassignFn },
      { title: RELATED_DATA_COUNTS.REFERENCES, value: 4 },
    ]

    await performReassignments('old-name', 'new-name', counts)

    expect(reassignFn).not.toHaveBeenCalled()
  })
})

describe('relatedDataCounts', () => {
  const buildApiFns = calls => ({
    apiPayload: vi.fn(),
    apiResult: vi.fn(async (fn, name) => {
      calls.push({ fn, name })
      return 1
    }),
  })

  it('counts every kind by the concept name when there is no pending rename', async () => {
    const calls = []
    const getReferences = vi.fn(() => [])

    const counts = await relatedDataCounts({
      apiFns: buildApiFns(calls),
      concept: { name: 'dingo-2' },
      getReferences,
    })

    expect(calls).toHaveLength(6)
    expect(calls.every(({ name }) => name === 'dingo-2')).toBe(true)
    expect(getReferences).toHaveBeenCalledWith('dingo-2')
    expect(counts).toHaveLength(7)
  })

  it('counts name-string data by the pre-rename name and skips concept-resolving endpoints', async () => {
    const calls = []
    const getReferences = vi.fn(() => [])

    const counts = await relatedDataCounts({
      apiFns: buildApiFns(calls),
      concept: { name: 'dingo-2' },
      getReferences,
      renamedFrom: 'dingo',
    })

    const nameFor = fn => calls.find(c => c.fn === fn)?.name
    expect(nameFor(getConceptAnnotationsCount)).toBe('dingo')
    expect(nameFor(getToConceptAssociationsCount)).toBe('dingo')
    expect(nameFor(getToConceptRealizationsCount)).toBe('dingo')
    expect(nameFor(getToConceptTemplateCount)).toBe('dingo')

    expect(calls.some(c => c.fn === getConceptRealizationCount)).toBe(false)
    expect(calls.some(c => c.fn === getConceptTemplateCount)).toBe(false)

    expect(getReferences).toHaveBeenCalledWith('dingo-2')

    const titles = counts.map(c => c.title)
    expect(titles).not.toContain(RELATED_DATA_COUNTS.REALIZATIONS)
    expect(titles).not.toContain(RELATED_DATA_COUNTS.TEMPLATES_DEFINED)
    expect(counts).toHaveLength(5)
  })
})
