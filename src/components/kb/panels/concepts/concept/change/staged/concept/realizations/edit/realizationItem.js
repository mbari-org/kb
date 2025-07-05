import { pick } from '@/lib/utils'

const EMPTY_REALIZATION_ITEM = {
  linkName: '',
  toConcept: '',
  linkValue: '',
}

const realizationItemFields = realizationItem =>
  pick(realizationItem, ['linkName', 'toConcept', 'linkValue'])

const realizationItemsEqual = (item1, item2) => {
  return (
    item1.linkName === item2.linkName &&
    item1.toConcept === item2.toConcept &&
    item1.linkValue === item2.linkValue
  )
}

export { EMPTY_REALIZATION_ITEM, realizationItemFields, realizationItemsEqual }
