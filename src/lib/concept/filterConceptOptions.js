import { createFilterOptions } from '@mui/material/Autocomplete'

const defaultFilterOptions = createFilterOptions()

const matchPriority = (option, input) => {
  if (option === input) return 0
  if (option.startsWith(input)) return 1
  return 2
}

const filterConceptOptions = (options, state) => {
  const filtered = defaultFilterOptions(options, state)
  const input = state.inputValue.trim().toLowerCase()
  if (!input) return filtered

  return filtered
    .map(option => ({ option, lower: option.toLowerCase() }))
    .sort((a, b) => {
      const priorityDiff = matchPriority(a.lower, input) - matchPriority(b.lower, input)
      if (priorityDiff !== 0) return priorityDiff
      return a.option.localeCompare(b.option, undefined, { sensitivity: 'base' })
    })
    .map(({ option }) => option)
}

export default filterConceptOptions
