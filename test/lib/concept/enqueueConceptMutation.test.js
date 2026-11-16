import { describe, expect, it } from 'vitest'

import enqueueConceptMutation from '@/lib/concept/enqueueConceptMutation'

const deferred = () => {
  let resolve
  let reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('enqueueConceptMutation', () => {
  it('serializes mutations in arrival order', async () => {
    const events = []
    const gate = deferred()

    const first = enqueueConceptMutation(async () => {
      events.push('first:start')
      await gate.promise
      events.push('first:end')
    })
    const second = enqueueConceptMutation(async () => {
      events.push('second:start')
    })

    await Promise.resolve()
    expect(events).toEqual(['first:start'])

    gate.resolve()
    await Promise.all([first, second])
    expect(events).toEqual(['first:start', 'first:end', 'second:start'])
  })

  it('serializes mutations regardless of concept', async () => {
    const events = []
    const gate = deferred()

    const first = enqueueConceptMutation(async () => {
      events.push('first:start')
      await gate.promise
      events.push('first:end')
    })
    const second = enqueueConceptMutation(async () => {
      events.push('second:start')
    })

    await Promise.resolve()
    expect(events).toEqual(['first:start'])

    gate.resolve()
    await Promise.all([first, second])
    expect(events).toEqual(['first:start', 'first:end', 'second:start'])
  })

  it('propagates the error to the caller without poisoning the queue', async () => {
    const failure = new Error('boom')
    const events = []

    const first = enqueueConceptMutation(async () => {
      throw failure
    })
    const second = enqueueConceptMutation(async () => {
      events.push('second:ran')
    })

    await expect(first).rejects.toBe(failure)
    await second
    expect(events).toEqual(['second:ran'])
  })
})
