import { describe, expect, it } from 'vitest'

import { applyApprovals } from '@/lib/concept/pending/applyApproves'
import { applyRejects } from '@/lib/concept/pending/applyRejects'
import { ACTION } from '@/lib/constants'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

const baseConcept = () => ({
  templates: [
    {
      linkName: 'has-part',
      toConcept: 'Fin',
      linkValue: 'nil',
    },
  ],
})

describe('template pending applyApprovals / applyRejects', () => {
  it('approves ADD by appending the template', () => {
    const concept = baseConcept()
    applyApprovals(concept, [
      {
        action: ACTION.ADD,
        field: HISTORY_FIELD.TEMPLATE,
        newValue: 'has-color|Blue|nil',
      },
    ])

    expect(concept.templates).toEqual([
      { linkName: 'has-part', toConcept: 'Fin', linkValue: 'nil' },
      { linkName: 'has-color', toConcept: 'Blue', linkValue: 'nil' },
    ])
  })

  it('approves DELETE by removing the matching template', () => {
    const concept = baseConcept()
    applyApprovals(concept, [
      {
        action: ACTION.DELETE,
        field: HISTORY_FIELD.TEMPLATE,
        oldValue: 'has-part|Fin|nil',
      },
    ])

    expect(concept.templates).toEqual([])
  })

  it('approves EDIT by replacing the matching template fields', () => {
    const concept = baseConcept()
    applyApprovals(concept, [
      {
        action: ACTION.EDIT,
        field: HISTORY_FIELD.TEMPLATE,
        oldValue: 'has-part|Fin|nil',
        newValue: 'has-part|Wing|nil',
      },
    ])

    expect(concept.templates).toEqual([
      { linkName: 'has-part', toConcept: 'Wing', linkValue: 'nil' },
    ])
  })

  it('rejects ADD by removing the pending template', () => {
    const concept = {
      templates: [
        { linkName: 'has-part', toConcept: 'Fin', linkValue: 'nil' },
        { linkName: 'has-color', toConcept: 'Blue', linkValue: 'nil' },
      ],
    }
    applyRejects(concept, [
      {
        action: ACTION.ADD,
        field: HISTORY_FIELD.TEMPLATE,
        newValue: 'has-color|Blue|nil',
      },
    ])

    expect(concept.templates).toEqual([
      { linkName: 'has-part', toConcept: 'Fin', linkValue: 'nil' },
    ])
  })

  it('rejects DELETE by restoring the template when missing', () => {
    const concept = { templates: [] }
    applyRejects(concept, [
      {
        action: ACTION.DELETE,
        field: HISTORY_FIELD.TEMPLATE,
        oldValue: 'has-part|Fin|nil',
      },
    ])

    expect(concept.templates).toEqual([
      { linkName: 'has-part', toConcept: 'Fin', linkValue: 'nil' },
    ])
  })

  it('rejects EDIT by restoring the previous template fields', () => {
    const concept = {
      templates: [{ linkName: 'has-part', toConcept: 'Wing', linkValue: 'nil' }],
    }
    applyRejects(concept, [
      {
        action: ACTION.EDIT,
        field: HISTORY_FIELD.TEMPLATE,
        oldValue: 'has-part|Fin|nil',
        newValue: 'has-part|Wing|nil',
      },
    ])

    expect(concept.templates).toEqual([
      { linkName: 'has-part', toConcept: 'Fin', linkValue: 'nil' },
    ])
  })
})
