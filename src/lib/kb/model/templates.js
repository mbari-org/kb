import { pick } from '@/lib/utils'

import { REALIZATION_FIELDS } from './realization'

const TEMPLATE_FIELDS = [...REALIZATION_FIELDS, 'templateId']

export const EMPTY_TEMPLATE = Object.fromEntries(TEMPLATE_FIELDS.map(field => [field, '']))

export const pickTemplate = object => pick(object, TEMPLATE_FIELDS)
