import { USER_ROLES } from '@/lib/constants'

const isAdmin = user => user.role === USER_ROLES.ADMIN
const isMaint = user => user.role === USER_ROLES.MAINT
const isReadOnly = user =>
  user.role === USER_ROLES.READ_ONLY ||
  (user.role !== USER_ROLES.ADMIN && user.role !== USER_ROLES.MAINT)

export { isAdmin, isMaint, isReadOnly }
