import { use } from 'react'

import { createActions } from '@/components/common/factory/createComponent'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'

import { PREFS } from '@/lib/constants/prefs.js'
import CONFIG from '@/text'

const phylogenyRootKey = PREFS.APP.PHYLOGENY.KEY
const { CANCEL, SAVE } = CONFIG.PANELS.CONCEPTS.BUTTON
const { SAVE_CONFIRM } = CONFIG.PANELS.ABOUT_HELP.PHYLOGENY_ROOT.ALERT

const PhylogenyRootActions = () => {
  const { closeModal, modalData, setModalData } = use(AppModalContext)
  const { phylogenyRoot, saveAppPreference } = use(ConfigContext)
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

  const onAction = label => {
    switch (label) {
      case CANCEL:
        closeModal(false)
        return

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
          return
        }
        return saveAppPreference(phylogenyRootKey, selectedConceptName).then(() => closeModal(true))
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'PhylogenyRootActions')
}

export default PhylogenyRootActions
