import { describe, expect, it } from 'vitest'

import panelModules from '@/components/kb/panels/modules'

describe('panel modules', () => {
  it('registers Realizations between References and Embargoes', () => {
    const panelNames = panelModules.map(({ name }) => name)
    const referencesIndex = panelNames.indexOf('References')
    const realizationsIndex = panelNames.indexOf('Realizations')
    const embargoesIndex = panelNames.indexOf('Embargoes')

    expect(referencesIndex).toBeGreaterThanOrEqual(0)
    expect(realizationsIndex).toBe(referencesIndex + 1)
    expect(embargoesIndex).toBe(realizationsIndex + 1)
  })
})
