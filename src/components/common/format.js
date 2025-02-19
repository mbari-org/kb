const formatDelta = (initialValue, editingValue) =>
  `${stringDisplay(initialValue)} --> ${stringDisplay(editingValue)}`

const formatField = field => {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

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
