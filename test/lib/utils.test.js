import { describe, expect, it } from 'vitest'

import { binSearch } from '@/lib/utils'

describe('binSearch', () => {
  it('returns false for empty array', () => {
    expect(binSearch([], 'concept')).toBe(false)
  })

  it('finds elements in sorted string arrays', () => {
    const names = ['Acantharea', 'Bathochordaeus', 'Careproctus', 'Diaulula', 'Eukrohnia']

    expect(binSearch(names, 'Acantharea')).toBe(true)
    expect(binSearch(names, 'Careproctus')).toBe(true)
    expect(binSearch(names, 'Eukrohnia')).toBe(true)
  })

  it('returns false when element is not present in sorted string arrays', () => {
    const names = ['Acantharea', 'Bathochordaeus', 'Careproctus', 'Diaulula', 'Eukrohnia']

    expect(binSearch(names, 'AAA')).toBe(false)
    expect(binSearch(names, 'Benthocodon')).toBe(false)
    expect(binSearch(names, 'ZZZ')).toBe(false)
  })

  it('handles single-element arrays', () => {
    expect(binSearch(['object'], 'object')).toBe(true)
    expect(binSearch(['object'], 'other')).toBe(false)
  })

  it('finds elements in sorted numeric arrays', () => {
    const numbers = [1, 3, 5, 7, 9, 11]

    expect(binSearch(numbers, 1)).toBe(true)
    expect(binSearch(numbers, 7)).toBe(true)
    expect(binSearch(numbers, 11)).toBe(true)
    expect(binSearch(numbers, 0)).toBe(false)
    expect(binSearch(numbers, 6)).toBe(false)
    expect(binSearch(numbers, 12)).toBe(false)
  })

  it('matches case-insensitively when flag is set', () => {
    const names = ['Acantharea', 'bathochordaeus', 'Careproctus', 'doliolid', 'Eukrohnia']

    expect(binSearch(names, 'acantharea', true)).toBe(true)
    expect(binSearch(names, 'BATHOCHORDAEUS', true)).toBe(true)
    expect(binSearch(names, 'DOLIOLID', true)).toBe(true)
    expect(binSearch(names, 'eukrohnia', true)).toBe(true)
    expect(binSearch(names, 'Benthocodon', true)).toBe(false)
  })

  it('remains case-sensitive by default', () => {
    const names = ['Acantharea', 'Bathochordaeus', 'Careproctus', 'Diaulula', 'Eukrohnia']

    expect(binSearch(names, 'acantharea')).toBe(false)
  })
})
