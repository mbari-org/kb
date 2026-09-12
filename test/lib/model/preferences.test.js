import LZString from 'lz-string'
import { describe, expect, it } from 'vitest'

import { createPreferencesPayload, parsePreferences } from '@/lib/model/preferences'

const DEFAULT_SORT = { field: 'creationTimestamp', order: 'desc' }

const roundTrip = settings =>
  parsePreferences([
    { key: 'settings', value: createPreferencesPayload('settings', settings).value },
  ]).settings

describe('preferences settings serialization', () => {
  it('round-trips per-type history sort settings', () => {
    const settings = {
      history: {
        type: 'pending',
        sort: {
          approved: { field: 'processorName', order: 'desc' },
          concept: { field: 'oldValue', order: 'asc' },
          pending: { field: 'concept', order: 'asc' },
        },
      },
      references: { byConcept: true },
      templates: {
        byAvailable: true,
        filters: { concept: 'dingo', toConcept: '', linkName: 'eats', linkValue: '' },
      },
    }

    expect(roundTrip(settings)).toEqual({
      history: {
        type: 'pending',
        sort: {
          approved: { field: 'processorName', order: 'desc' },
          concept: { field: 'oldValue', order: 'asc' },
          pending: { field: 'concept', order: 'asc' },
        },
      },
      references: { byConcept: true },
      templates: {
        byAvailable: true,
        filters: { concept: 'dingo', linkName: 'eats' },
      },
    })
  })

  it('round-trips every sortable field and order coding', () => {
    const fields = [
      'action',
      'concept',
      'creationTimestamp',
      'creatorName',
      'field',
      'newValue',
      'oldValue',
      'processedTimestamp',
      'processorName',
    ]

    fields.forEach((field, index) => {
      const order = index % 2 === 0 ? 'asc' : 'desc'
      const settings = {
        history: { type: 'approved', sort: { approved: { field, order } } },
      }
      const parsed = roundTrip(settings)
      expect(parsed.history.sort.approved).toEqual({ field, order })
      expect(parsed.history.sort.concept).toEqual(DEFAULT_SORT)
      expect(parsed.history.sort.pending).toEqual(DEFAULT_SORT)
    })
  })

  it('fills sort defaults for preferences stored before the sort slot existed', () => {
    const legacyValue = LZString.compressToBase64(
      JSON.stringify(['a', 1, 0, ['sharks', '', 'eats', '']])
    )

    const parsed = parsePreferences([{ key: 'settings', value: legacyValue }]).settings

    expect(parsed.history).toEqual({
      type: 'approved',
      sort: {
        approved: DEFAULT_SORT,
        concept: DEFAULT_SORT,
        pending: DEFAULT_SORT,
      },
    })
    expect(parsed.templates.filters).toEqual({ concept: 'sharks', linkName: 'eats' })
  })

  it('fills sort defaults for unknown stored sort codes', () => {
    const legacyValue = LZString.compressToBase64(
      JSON.stringify(['c', 0, 0, ['', '', '', ''], [['zz', 'x'], [], null]])
    )

    const parsed = parsePreferences([{ key: 'settings', value: legacyValue }]).settings

    expect(parsed.history).toEqual({
      type: 'concept',
      sort: {
        approved: DEFAULT_SORT,
        concept: DEFAULT_SORT,
        pending: DEFAULT_SORT,
      },
    })
  })
})
