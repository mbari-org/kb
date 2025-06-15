import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { PENDING } from '@/lib/constants'

import { renameConceptAssociations } from '@/lib/api/associations'
const { CHANGE_NAME } = PENDING

const useUpdateAssociatedData = pendingActions => {
  const { config } = use(ConfigContext)
  const { modalData } = use(ModalContext)

  const updateAssociatedData = useCallback(
    async id => {
      const pendingAction = pendingActions.find(pending => pending.id === id)

      if (
        pendingAction.action === 'REPLACE' &&
        pendingAction.field === 'ConceptName' &&
        modalData.nameChangeType === CHANGE_NAME.ASSOCIATED_DATA
      ) {
        await renameConceptAssociations(config, {
          new: pendingAction.newValue,
          old: pendingAction.oldValue,
        })
      }
    },
    [config, modalData?.nameChangeType, pendingActions]
  )

  return updateAssociatedData
}

export default useUpdateAssociatedData
