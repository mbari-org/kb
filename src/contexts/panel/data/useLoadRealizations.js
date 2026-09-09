import { useCallback } from 'react'

import { getRealizations } from '@/lib/api/realizations'
import { PAGINATION } from '@/lib/constants/pagination.js'

const { REALIZATIONS } = PAGINATION
const LOAD_PAGE_SIZE = Math.max(...REALIZATIONS.PAGE_SIZE_OPTIONS)
const LOAD_BATCH_SIZE = 5
const asString = value => {
  if (typeof value === 'string') {
    return value
  }
  if (value && typeof value === 'object') {
    if (typeof value.name === 'string') return value.name
    if (typeof value.value === 'string') return value.value
    if (typeof value.label === 'string') return value.label
  }
  return ''
}

const normalizeRealization = realization => ({
  ...realization,
  concept: asString(
    realization?.concept ??
      realization?.conceptName ??
      realization?.fromConcept ??
      realization?.sourceConcept
  ),
  linkName: asString(realization?.linkName ?? realization?.relationship),
  linkValue: asString(realization?.linkValue ?? realization?.value),
  toConcept: asString(realization?.toConcept ?? realization?.targetConcept ?? realization?.to),
  lastUpdated: realization?.lastUpdated ?? realization?.updatedTimestamp ?? realization?.updatedAt ?? null,
})
const normalizeRealizations = payload => {
  if (Array.isArray(payload)) return payload.map(normalizeRealization)
  if (Array.isArray(payload?.content)) return payload.content.map(normalizeRealization)
  if (Array.isArray(payload?.linkrealizations)) return payload.linkrealizations.map(normalizeRealization)
  if (Array.isArray(payload?.realizations)) return payload.realizations.map(normalizeRealization)
  return []
}

const useLoadRealizations = apiFns => {
  const loadRealizations = useCallback(async () => {
    const allPages = []
    let offset = 0

    while (true) {
      const batch = await Promise.all(
        Array.from({ length: LOAD_BATCH_SIZE }, (_, i) =>
          apiFns.apiPayload(getRealizations, {
            limit: LOAD_PAGE_SIZE,
            offset: offset + i * LOAD_PAGE_SIZE,
          })
        )
      )

      let exhausted = false
      for (const pagePayload of batch) {
        const page = normalizeRealizations(pagePayload)
        if (page.length === 0) {
          exhausted = true
          break
        }
        allPages.push(...page)
        if (page.length < LOAD_PAGE_SIZE) {
          exhausted = true
          break
        }
      }
      if (exhausted) break

      offset += LOAD_BATCH_SIZE * LOAD_PAGE_SIZE
    }

    const allRealizations = allPages
    if (allRealizations.length === 0) {
      return []
    }
    return allRealizations
  }, [apiFns])

  return loadRealizations
}

export default useLoadRealizations
