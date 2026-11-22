import CONFIG from '@/lib/config'
import { createError } from '@/lib/errors'

const RENAME_REJECT_BLOCKED = 'Rename Reject Blocked'

const RENAME_REJECT_REASON = {
  ALIAS_HELD: 'ALIAS_HELD',
  CONCEPT_ADDED: 'CONCEPT_ADDED',
}

const createRenameRejectBlocked = (reason, name, owner = null) =>
  createError(RENAME_REJECT_BLOCKED, `Cannot reject the rename of "${name}" while "${name}" is in use`, {
    name,
    owner,
    reason,
  })

const isRenameRejectBlocked = error => error.title === RENAME_REJECT_BLOCKED

const renameRejectLines = error => {
  const { name, owner, reason } = error.details
  return CONFIG.PANELS.CONCEPTS.MODALS.PENDING.RENAME_REJECT[reason].map(line =>
    line.replaceAll('{name}', name).replaceAll('{owner}', owner)
  )
}

export { createRenameRejectBlocked, isRenameRejectBlocked, RENAME_REJECT_REASON, renameRejectLines }
