import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { PENDING } from '@/lib/constants'

import { updateAssociations } from '@/lib/kb/api/associations'
import { updateObservations } from '@/lib/kb/api/observations'
const { CHANGE_NAME } = PENDING

const useUpdateNameAssociatedData = pendingActions => {
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
        const payload = {
          new: pendingAction.newValue,
          old: pendingAction.oldValue,
        }

        await updateAssociations(config, payload)
        await updateObservations(config, payload)
      }
    },
    [config, modalData?.nameChangeType, pendingActions]
  )

  return updateAssociatedData
}

export default useUpdateNameAssociatedData
