import { describe, expect, it } from 'vitest'

import { validateConceptInput, validateNameChange } from '@/components/modal/concept/conceptModalUtils'

describe('conceptModalUtils validation helpers', () => {
  describe('validateConceptInput', () => {
    const existingNames = ['root', 'Aulacoctena', 'Bathyctena', 'Child']

    it('returns true when input is in existingNames and not omitted', () => {
      expect(validateConceptInput('Aulacoctena', existingNames, ['root', 'Child'])).toBe(true)
      expect(validateConceptInput('  Bathyctena  ', existingNames, ['root'])).toBe(true)
    })

    it('returns false when input is empty or whitespace', () => {
      expect(validateConceptInput('', existingNames)).toBe(false)
      expect(validateConceptInput('   ', existingNames)).toBe(false)
      expect(validateConceptInput(null, existingNames)).toBe(false)
    })

    it('returns false when input is not in existingNames', () => {
      expect(validateConceptInput('NonExistent', existingNames)).toBe(false)
    })

    it('returns false when input is in omitChoices', () => {
      expect(validateConceptInput('Child', existingNames, ['Child'])).toBe(false)
    })
  })

  describe('validateNameChange', () => {
    it('validates new name against current and existing names', () => {
      expect(validateNameChange('NewName', 'OldName', ['OldName', 'root'])).toBe(true)
      expect(validateNameChange('OldName', 'OldName', ['OldName', 'root'])).toBe(false)
      expect(validateNameChange('root', 'OldName', ['OldName', 'root'])).toBe(false)
      expect(validateNameChange('', 'OldName', ['OldName'])).toBe(false)
    })
  })
})
