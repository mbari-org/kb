import { PENDING } from '@/lib/constants/pending.js'

const fieldColorSx = predicate => {
  if (predicate) {
    return { ...fieldSx, color: 'text.disabled' }
  }
  return fieldSx
}

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

const otherApprovalSx = approval => fieldColorSx(approval === PENDING.APPROVAL.OTHER)

const valueSx = {
  ...fieldSx,
  fontFamily: 'monospace',
  fontWeight: 800,
}

const stringDisplay = field => (field !== '' ? field : '""')

export { fieldColorSx, fieldSx, formatDelta, formatField, otherApprovalSx, valueSx }
