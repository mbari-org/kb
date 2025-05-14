import { use, useMemo, useCallback } from 'react'

import { createActions } from '@/components/modal/factory'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { LABELS, PENDING, PROCESSING } from '@/lib/constants'

import updatePending from '@/contexts/concept/pending/updatePending'

const { APPROVE, APPROVE_ALL, CONFIRM, DEFER, REJECT, REJECT_ALL } = LABELS.BUTTON
const { APPROVAL, GROUP } = PENDING

const PendingActions = () => {
  const { config } = use(ConfigContext)
  const { confirmPending, pendingHistory, setConfirmPending } = use(ConceptContext)
  const { closeModal, setProcessing } = use(ModalContext)
  const { refreshHistory } = use(TaxonomyContext)

  const [disabled, labels] = useMemo(() => {
    if (!confirmPending) {
      return [
        [false, false, false],
        [APPROVE_ALL, DEFER, REJECT_ALL],
      ]
    }
    if (confirmPending.approval === APPROVAL.ACCEPT && confirmPending.change === GROUP.ALL) {
      return [
        [false, false, true],
        [CONFIRM, DEFER, REJECT_ALL],
      ]
    }
    if (confirmPending.approval === APPROVAL.REJECT && confirmPending.change === GROUP.ALL) {
      return [
        [true, false, false],
        [APPROVE_ALL, DEFER, CONFIRM],
      ]
    }

    if (confirmPending.approval === APPROVAL.ACCEPT) {
      return [
        [false, false, true],
        [CONFIRM, DEFER, REJECT],
      ]
    }

    if (confirmPending.approval === APPROVAL.REJECT) {
      return [
        [true, false, false],
        [APPROVE, DEFER, CONFIRM],
      ]
    }
  }, [confirmPending])

  const colors = ['clean', 'main', 'cancel']

  const onAction = useCallback(
    label => {
      switch (label) {
        case APPROVE_ALL:
          setConfirmPending({ approval: APPROVAL.ACCEPT, change: GROUP.ALL })
          break

        case CONFIRM:
          setProcessing(PROCESSING.UPDATING)
          updatePending({ config, confirmPending, pendingHistory }).then(() => {
            refreshHistory().then(() => {
              setConfirmPending(null)
              setProcessing(null)
            })
          })
          break

        case DEFER:
          if (!confirmPending) {
            closeModal()
          }
          setConfirmPending(null)
          break

        case REJECT_ALL:
          setConfirmPending({ approval: APPROVAL.REJECT, change: GROUP.ALL })
          break

        default:
          setConfirmPending(null)
          closeModal()
          break
      }
    },
    [
      closeModal,
      config,
      confirmPending,
      pendingHistory,
      refreshHistory,
      setConfirmPending,
      setProcessing,
    ]
  )

  return createActions({ colors, disabled, labels, onAction }, 'PendingActions')
}

export default PendingActions
