import { isJsonEqual } from '@/lib/utils'

const generalStateUpdates = (field, initial, staged) => {
  const initialValue = initial[field]
  const stagedValue = staged[field]

  if (isJsonEqual(initialValue, stagedValue)) {
    return {}
  }

  return {
    [field]: {
      initial: initialValue,
      staged: stagedValue,
    },
  }
}

export { generalStateUpdates }
