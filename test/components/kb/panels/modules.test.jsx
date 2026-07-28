import { describe, expect, it } from 'vitest'

import panelModules from '@/components/kb/panels/modules'

describe('panel modules', () => {
  it('exports a non-empty panel module list', () => {
    expect(Array.isArray(panelModules)).toBe(true)
    expect(panelModules.length).toBeGreaterThan(0)
  })

  it('registers unique, non-empty panel names', () => {
    const panelNames = panelModules.map(({ name }) => name)

    expect(panelNames.every(name => typeof name === 'string' && name.trim().length > 0)).toBe(true)
    expect(new Set(panelNames).size).toBe(panelNames.length)
  })
})
