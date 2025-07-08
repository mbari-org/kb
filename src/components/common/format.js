const formatDelta = (initialValue, stagedValue) =>
  `${stringDisplay(initialValue)} \u27F9 ${stringDisplay(stagedValue)}`

const formatField = field =>
  field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()

const fieldSx = {
  fontSize: '1.25rem',
  whiteSpace: 'pre-wrap',
}

const valueSx = {
  ...fieldSx,
  fontFamily: 'monospace',
  fontWeight: 800,
}

const stringDisplay = field => (field !== '' ? field : '""')

export { fieldSx, formatDelta, formatField, valueSx }
