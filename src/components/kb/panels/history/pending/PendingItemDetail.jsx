import { use } from 'react'

import PendingAliasItem from '@/components/kb/panels/history/pending/PendingAliasItem'
import PendingChildItem from '@/components/kb/panels/history/pending/PendingChildItem'
import PendingMediaItem from '@/components/kb/panels/history/pending/PendingMediaItem'
import PendingNameItem from '@/components/kb/panels/history/pending/PendingNameItem'
import PendingParentItem from '@/components/kb/panels/history/pending/PendingParentItem'
import PendingRankItem from '@/components/kb/panels/history/pending/PendingRankItem'
import PendingRealizationItem from '@/components/kb/panels/history/pending/PendingRealizationItem'

import { isPendingName } from '@/lib/kb/state/name'

import { usePanelModalDataContext } from '@/contexts/panel/modal/Context'

import UserContext from '@/contexts/user/UserContext'

import { createError } from '@/lib/errors'

import { HISTORY_FIELD } from '@/lib/kb/constants/historyField.js'

const { ALIAS, CHILD, MEDIA, NAME, PARENT, RANK, REALIZATION, TEMPLATE } = HISTORY_FIELD

const PendingItemDetail = props => {
  const { modalData } = usePanelModalDataContext()
  const { user } = use(UserContext)
  const { item } = { ...modalData, ...props }

  if (!item?.field) return null

  switch (item.field) {
    case ALIAS:
      return <PendingAliasItem item={item} />

    case CHILD:
      return <PendingChildItem item={item} />

    case MEDIA:
      return <PendingMediaItem item={item} />

    case NAME:
      if (isPendingName(item)) {
        return <PendingNameItem item={item} user={user} />
      }
      return <PendingAliasItem item={item} />

    case PARENT:
      return <PendingParentItem item={item} />

    case RANK:
      return <PendingRankItem item={item} />

    case REALIZATION:
      return <PendingRealizationItem item={item} />

    case TEMPLATE:
      return <PendingRealizationItem item={item} />

    default:
      throw createError(
        'Invalid Field Type',
        `Cannot display pending item with unknown field type: ${item.field}`,
        { item }
      )
  }
}

export default PendingItemDetail
