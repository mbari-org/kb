import { use, useCallback, useRef } from 'react'

import createAppModal from '@/components/modal/app/createAppModal'
import ExportCompleteContent from '@/components/kb/export/ExportCompleteContent'
import ExportCompleteTitle from '@/components/kb/export/ExportCompleteTitle'

import AppModalContext from '@/contexts/app/AppModalContext'

import CONFIG from '@/text'

const { PROCESSING } = CONFIG

const useConceptExportProgress = () => {
  const { beginProcessing, setModal, setModalData } = use(AppModalContext)
  const processingStopRef = useRef(null)

  return useCallback(
    value => {
      if (value === false) {
        if (processingStopRef.current) {
          processingStopRef.current()
          processingStopRef.current = null
        }
      } else if (value?.status === 'done' && value.fileName) {
        if (processingStopRef.current) {
          processingStopRef.current()
          processingStopRef.current = null
        }
        const modal = createAppModal({
          Content: ExportCompleteContent,
          Title: ExportCompleteTitle,
          minWidth: 420,
          focusClose: true,
        })
        setModalData({ fileName: value.fileName })
        setModal(modal)
      } else if (typeof value === 'string') {
        if (!processingStopRef.current) {
          const stop = beginProcessing(PROCESSING.LOAD, null, { delayMs: 0 })
          if (stop.updateMessage) {
            stop.updateMessage(value)
          }
          processingStopRef.current = stop
        } else if (processingStopRef.current.updateMessage) {
          processingStopRef.current.updateMessage(value)
        }
      }
    },
    [beginProcessing, setModal, setModalData]
  )
}

export default useConceptExportProgress
