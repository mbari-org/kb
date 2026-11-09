import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/services/oni/methods', () => ({
  oniGet: vi.fn(),
  oniUserDelete: vi.fn(),
  oniUserPost: vi.fn(),
  oniUserPut: vi.fn(),
}))

import { oniUserPut } from '@/lib/services/oni/methods'
import { patchPrimaryImageFlag } from '@/lib/api/media'

const config = { url: 'https://example.test' }
const apiFns = { apiPayload: (fn, args) => fn(config, args) }

const mediaItem = (id, url, isPrimary = false) => ({ id, url, credit: 'credit', isPrimary })

describe('patchPrimaryImageFlag', () => {
  it('does nothing when the concept has no media', async () => {
    const concept = { name: 'Nemertea', media: [] }

    await patchPrimaryImageFlag(apiFns, concept)

    expect(oniUserPut).not.toHaveBeenCalled()
  })

  it('does nothing when a media item is already primary', async () => {
    const concept = {
      name: 'Nemertea',
      media: [mediaItem(1, 'http://x/Nemertea_01.jpg'), mediaItem(2, 'http://x/Nemertea_02.jpg', true)],
    }

    await patchPrimaryImageFlag(apiFns, concept)

    expect(oniUserPut).not.toHaveBeenCalled()
    expect(concept.media[0].isPrimary).toBe(false)
  })

  it('promotes the _01 image when no media is primary', async () => {
    const concept = {
      name: 'Nemertea',
      media: [
        mediaItem(1, 'http://x/Nemertea_02.jpg'),
        mediaItem(2, 'http://x/Nemertea_01.jpg'),
        mediaItem(3, 'http://x/Nemertea_03.jpg'),
      ],
    }
    oniUserPut.mockResolvedValueOnce({ payload: {} })

    await patchPrimaryImageFlag(apiFns, concept)

    expect(oniUserPut).toHaveBeenCalledWith({
      config,
      path: ['media', 2],
      data: { isPrimary: true },
    })
    expect(concept.media[1].isPrimary).toBe(true)
    expect(concept.media[0].isPrimary).toBe(false)
  })

  it('promotes an image when there is no _01 image', async () => {
    const concept = {
      name: 'Bathyceramaster careyi',
      media: [mediaItem(1, 'http://x/Bathyceramaster_careyi_02.png'), mediaItem(2, 'http://x/Bathyceramaster_careyi_03.png')],
    }
    oniUserPut.mockResolvedValueOnce({ payload: {} })

    await patchPrimaryImageFlag(apiFns, concept)

    expect(oniUserPut).toHaveBeenCalledWith({
      config,
      path: ['media', 1],
      data: { isPrimary: true },
    })
    expect(concept.media[0].isPrimary).toBe(true)
  })

  it('prefers an image over other media types', async () => {
    const concept = {
      name: 'Mertensiidae sp. B',
      media: [mediaItem(1, 'http://x/clip_01.mp4'), mediaItem(2, 'http://x/Mertensiidae_spB_03.png')],
    }
    oniUserPut.mockResolvedValueOnce({ payload: {} })

    await patchPrimaryImageFlag(apiFns, concept)

    expect(oniUserPut).toHaveBeenCalledWith({
      config,
      path: ['media', 2],
      data: { isPrimary: true },
    })
    expect(concept.media[1].isPrimary).toBe(true)
  })

  it('does not flag the item locally when the server update fails', async () => {
    const concept = { name: 'Nemertea', media: [mediaItem(1, 'http://x/Nemertea_01.jpg')] }
    oniUserPut.mockRejectedValueOnce(new Error('server error'))

    await expect(patchPrimaryImageFlag(apiFns, concept)).rejects.toThrow('server error')
    expect(concept.media[0].isPrimary).toBe(false)
  })
})
