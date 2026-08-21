import { ROLES } from '@/lib/constants/roles.js'

const isAdmin = user => user.role === ROLES.ADMIN
const isReadOnly = user => user.role !== ROLES.ADMIN && user.role !== ROLES.MAINT

export { isAdmin, isReadOnly }
