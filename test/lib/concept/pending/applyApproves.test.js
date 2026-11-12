import { describe, expect, it } from 'vitest'

import applyApprovals from '@/lib/concept/pending/applyApproves'
import { ACTION } from '@/lib/constants'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

const renamedConcept = () => ({
  name: 'dingo-2',
  parent: 'root',
  aliases: [{ name: 'dingo' }],
  alternateNames: ['dingo'],
  children: [],
})

const renameItem = {
  concept: 'dingo-2',
  field: HISTORY_FIELD.NAME,
  action: ACTION.EDIT,
  oldValue: 'dingo',
  newValue: 'dingo-2',
}

describe('applyApprovals', () => {
  it('applies a primary name rename to the concept name, not the aliases', () => {
    const concept = renamedConcept()

    applyApprovals(concept, [renameItem])

    expect(concept.name).toBe('dingo-2')
    expect(concept.alternateNames).toEqual(['dingo'])
  })

  it('keeps the old name as an alias when a rename and an alias add are approved together', () => {
    const concept = renamedConcept()
    const aliasAddItem = {
      concept: 'dingo-2',
      field: HISTORY_FIELD.ALIAS,
      action: ACTION.ADD,
      newValue: 'dingo',
    }

    applyApprovals(concept, [renameItem, aliasAddItem])

    expect(concept.name).toBe('dingo-2')
    expect(concept.alternateNames).toEqual(['dingo'])
  })

  it('applies an alias edit to the aliases', () => {
    const concept = renamedConcept()
    const aliasEditItem = {
      concept: 'dingo-2',
      field: HISTORY_FIELD.ALIAS,
      action: ACTION.EDIT,
      oldValue: 'dingo',
      newValue: 'wild-dingo',
    }

    applyApprovals(concept, [aliasEditItem])

    expect(concept.name).toBe('dingo-2')
    expect(concept.alternateNames).toEqual(['wild-dingo'])
  })
})
