import { ACTION } from '@/lib/constants'
import theme from '@/lib/theme'

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

export { actionColor, actionVerb }
