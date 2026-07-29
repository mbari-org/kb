import { use } from 'react'

import { createActions } from '@/components/common/factory/createComponent'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'

import { PREFS } from '@/lib/constants/prefs.js'
import CONFIG from '@/lib/config'

const phylogenyRootKey = PREFS.APP.PHYLOGENY.ROOT.KEY
const { CANCEL, SAVE } = CONFIG.PANELS.CONCEPTS.BUTTON
const { SAVE_CONFIRM } = CONFIG.PANELS.ABOUT_HELP.PHYLOGENY_ROOT.ALERT

const PhylogenyRootActions = () => {
  const { closeModal, modalData, setModalData } = use(AppModalContext)
  const { phylogenyRoot, saveAppPreference } = use(ConfigContext)
  const onCancel = modalData.onCancel
  const confirmCommit = Boolean(modalData.confirmCommit)
  const selectedPhylogenyRoot = modalData.selectedPhylogenyRoot || ''
  const resolveConceptPrimaryName = modalData.getConceptPrimaryName
  const selectedConceptName = resolveConceptPrimaryName
    ? resolveConceptPrimaryName(selectedPhylogenyRoot)
    : selectedPhylogenyRoot
  const isCurrentPhylogenyRoot = selectedConceptName === phylogenyRoot

  const colors = ['cancel', 'main']
  const disabled = [false, !selectedPhylogenyRoot || isCurrentPhylogenyRoot]
  const labels = [CANCEL, SAVE]

  const onAction = async label => {
    switch (label) {
      case CANCEL:
        if (!closeModal(false)) {
          break
        }
        if (typeof onCancel === 'function') {
          onCancel()
        }
        break

      case SAVE:
        if (!confirmCommit) {
          setModalData(prev => ({
            ...prev,
            confirmCommit: true,
            alert: {
              lines: SAVE_CONFIRM.LINES,
              severity: SAVE_CONFIRM.SEVERITY,
            },
          }))
          break
        }

        await saveAppPreference(phylogenyRootKey, selectedConceptName)
        if (!closeModal(true)) {
          break
        }
        if (typeof onCancel === 'function') {
          onCancel()
        }
        break

      default:
        throw new Error(`Invalid phylogeny root action: ${label}`)
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'PhylogenyRootActions')
}

export default PhylogenyRootActions
