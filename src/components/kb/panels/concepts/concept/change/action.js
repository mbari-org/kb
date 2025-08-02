import { formatDelta } from '@/components/common/format'
import theme from '@/lib/theme'

import { ACTION } from '@/lib/constants'

const actionVerb = action => action.split(' ').shift()

const actionColor = action => {
  const verb = actionVerb(action)
  switch (verb) {
    case ACTION.ADD:
      return theme.palette.primary.add

    case ACTION.EDIT:
      return theme.palette.primary.edit

    case ACTION.DELETE:
      return theme.palette.primary.remove

    default:
      return theme.palette.common.black
  }
}

const pendingActionValue = pending => {
  switch (pending.action) {
    case ACTION.ADD:
      return pending.newValue

    case ACTION.DELETE:
      return pending.oldValue

    case ACTION.REPLACE:
      return formatDelta(pending.oldValue, pending.newValue)

    default:
      return ''
  }
}

export { actionColor, actionVerb, pendingActionValue }
