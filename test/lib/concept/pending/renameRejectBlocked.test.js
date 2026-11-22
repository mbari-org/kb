import { describe, expect, it } from 'vitest'

import {
  createRenameRejectBlocked,
  isRenameRejectBlocked,
  RENAME_REJECT_REASON,
  renameRejectLines,
} from '@/lib/concept/pending/renameRejectBlocked'
import CONFIG from '@/lib/config'

const { RENAME_REJECT } = CONFIG.PANELS.CONCEPTS.MODALS.PENDING

describe('renameRejectBlocked', () => {
  it('recognizes only the blocked reject error', () => {
    expect(isRenameRejectBlocked(createRenameRejectBlocked(RENAME_REJECT_REASON.CONCEPT_ADDED, 'dingo'))).toBe(true)
    expect(isRenameRejectBlocked({ title: 'Server Error' })).toBe(false)
  })

  it('explains that a concept with the old name has been added', () => {
    const error = createRenameRejectBlocked(RENAME_REJECT_REASON.CONCEPT_ADDED, 'dingo')

    const expected = RENAME_REJECT.CONCEPT_ADDED.map(line => line.replaceAll('{name}', 'dingo'))

    expect(renameRejectLines(error)).toEqual(expected)
  })

  it('explains that another concept holds the old name as an alias', () => {
    const error = createRenameRejectBlocked(RENAME_REJECT_REASON.ALIAS_HELD, 'dingo', 'fox')
    const expected = RENAME_REJECT.ALIAS_HELD.map(line =>
      line.replaceAll('{name}', 'dingo').replaceAll('{owner}', 'fox')
    )

    expect(renameRejectLines(error)).toEqual(expected)
  })
})
