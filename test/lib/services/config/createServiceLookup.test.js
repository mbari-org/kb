import { describe, expect, it } from 'vitest'

import createServiceLookup from '@/lib/services/config/createServiceLookup'

describe('createServiceLookup', () => {
  it('retains service secrets in the in-memory lookup and adds Raziel bootstrap metadata', () => {
    const getService = createServiceLookup(
      [
        { name: 'oni', secret: 'oni-api-key', url: 'https://example.test/kb/v1' },
        { name: 'annosaurus', secret: 'anno-api-key', url: 'https://example.test/anno/v1' },
      ],
      'https://example.test/config'
    )

    expect(getService('oni')).toEqual({
      secret: 'oni-api-key',
      url: 'https://example.test/kb/v1',
    })
    expect(getService('annosaurus')).toEqual({
      secret: 'anno-api-key',
      url: 'https://example.test/anno/v1',
    })
    expect(getService('raziel')).toEqual({
      secret: undefined,
      url: 'https://example.test/config',
    })
  })
})
