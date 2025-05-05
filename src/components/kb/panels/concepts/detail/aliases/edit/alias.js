import { isJsonEqual, pick } from '@/lib/util'

import { ALIAS_TYPES } from '@/lib/kb/model/alias'

const ALIAS_FIELDS = ['author', 'name', 'nameType']
const aliasFields = alias => pick(alias, ALIAS_FIELDS)
const aliasesEqual = (a, b) => isJsonEqual(aliasFields(a), aliasFields(b))

const EMPTY_ALIAS = {
  author: '',
  name: '',
  nameType: ALIAS_TYPES[0],
}

export { aliasesEqual, aliasFields, EMPTY_ALIAS }
