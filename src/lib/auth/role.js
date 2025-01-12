const ADMIN = "Admin"
const MAINT = "Maint"
const READ_ONLY = "ReadOnly"

// ReadOnly is the default role

const isAdmin = user => user.role === ADMIN
const isMaint = user => user.role === MAINT
const isReadOnly = user =>
  user.role === READ_ONLY || (user.role !== ADMIN && user.role !== MAINT)

export { isAdmin, isMaint, isReadOnly }
