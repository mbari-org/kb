import { describe, expect, it } from 'vitest'

import applyMediaResults from '@/contexts/panels/concepts/staged/save/applier/applyMediaResults'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const { ADD, DELETE, EDIT } = CONCEPT_STATE.MEDIA_ITEM

const mediaItem = (id, url, isPrimary = false) => ({ id, isPrimary, url })

describe('applyMediaResults', () => {
  it('appends an added media item from the response payload, sorted by url', () => {
    const concept = { media: [mediaItem(1, 'https://x/b_02.jpg')] }
    const response = mediaItem(2, 'https://x/b_01.jpg', true)

    applyMediaResults({ concept, isAdmin: true, result: { action: ADD, response } })

    expect(concept.media).toEqual([response, mediaItem(1, 'https://x/b_02.jpg')])
  })

  it('replaces an edited media item by id with the response payload', () => {
    const existing = mediaItem(1, 'https://x/b_01.jpg')
    const concept = { media: [existing, mediaItem(2, 'https://x/b_02.jpg')] }
    const response = mediaItem(1, 'https://x/b_01.jpg', true)

    applyMediaResults({ concept, isAdmin: true, result: { action: EDIT, params: [1, {}], response } })

    expect(concept.media).toEqual([response, mediaItem(2, 'https://x/b_02.jpg')])
  })

  it('removes a deleted media item by id for admins', () => {
    const concept = { media: [mediaItem(1, 'https://x/b_01.jpg'), mediaItem(2, 'https://x/b_02.jpg')] }

    applyMediaResults({ concept, isAdmin: true, result: { action: DELETE, params: 1 } })

    expect(concept.media).toEqual([mediaItem(2, 'https://x/b_02.jpg')])
  })

  it('keeps a deleted media item for non-admins since the server leaves it pending', () => {
    const concept = { media: [mediaItem(1, 'https://x/b_01.jpg'), mediaItem(2, 'https://x/b_02.jpg')] }

    applyMediaResults({ concept, isAdmin: false, result: { action: DELETE, params: 1 } })

    expect(concept.media).toHaveLength(2)
  })

  it('demotes an earlier same-type primary when a later added response is primary', () => {
    const firstResponse = mediaItem(1, 'https://x/b_01.jpg', true)
    const secondResponse = mediaItem(2, 'https://x/b_02.jpg', true)
    const concept = { media: [] }

    applyMediaResults({ concept, isAdmin: true, result: { action: ADD, response: firstResponse } })
    applyMediaResults({ concept, isAdmin: true, result: { action: ADD, response: secondResponse } })

    expect(concept.media).toEqual([
      { ...firstResponse, isPrimary: false },
      secondResponse,
    ])
  })

  it('demotes other same-type primaries when an edited response is primary', () => {
    const concept = { media: [mediaItem(1, 'https://x/b_01.jpg', true), mediaItem(2, 'https://x/b_02.jpg')] }
    const response = mediaItem(2, 'https://x/b_02.jpg', true)

    applyMediaResults({ concept, isAdmin: true, result: { action: EDIT, params: [2, {}], response } })

    expect(concept.media).toEqual([mediaItem(1, 'https://x/b_01.jpg'), response])
    expect(concept.media.filter(item => item.isPrimary)).toEqual([response])
  })
})
