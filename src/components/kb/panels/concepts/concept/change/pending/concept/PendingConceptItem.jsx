import ChildDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/ChildDetail'
import NameDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/NameDetail'
import PendingItem from '@/components/kb/panels/concepts/concept/change/pending/PendingItem'

import { isPendingName } from '@/lib/concept/state/name'

import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

const PendingConceptItem = ({ item }) => {
  if (item.field === HISTORY_FIELD.CHILD) {
    return <ChildDetail pendingChild={item} />
  }

  if (isPendingName(item)) {
    return <NameDetail pendingName={item} />
  }

  return <PendingItem item={item} />
}

export default PendingConceptItem
