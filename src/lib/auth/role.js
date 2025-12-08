import { ROLES } from '@/constants/roles.js'

const isAdmin = user => user.role === ROLES.ADMIN
const isMaint = user => user.role === ROLES.MAINT
const isReadOnly = user =>
  user.role === ROLES.READ_ONLY ||
  (user.role !== ROLES.ADMIN && user.role !== ROLES.MAINT)

export { isAdmin, isMaint, isReadOnly }
