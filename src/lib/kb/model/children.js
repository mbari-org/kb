const CHILD_FIELDS = ['author', 'name', 'rankName', 'rankLevel']

const EMPTY_CHILD = CHILD_FIELDS.reduce((acc, field) => {
  acc[field] = ''
  return acc
}, {})

export { CHILD_FIELDS, EMPTY_CHILD }
