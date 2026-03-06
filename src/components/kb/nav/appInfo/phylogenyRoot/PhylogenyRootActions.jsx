import { use } from 'react'

import { createActions } from '@/components/common/factory/createComponent'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'

import { PREFS } from '@/lib/constants/prefs.js'
import CONFIG from '@/text'

const phylogenyRootKey = PREFS.APP.PHYLOGENY.KEY
const { CANCEL, SAVE } = CONFIG.PANELS.CONCEPTS.BUTTON

const PhylogenyRootActions = () => {
  const { closeModal, modalData } = use(AppModalContext)
  const { saveAppPreference } = use(ConfigContext)
  const selectedPhylogenyRoot = modalData.selectedPhylogenyRoot || ''
  const resolveConceptPrimaryName = modalData.getConceptPrimaryName

  const colors = ['cancel', 'main']
  const disabled = [false, !selectedPhylogenyRoot]
  const labels = [CANCEL, SAVE]

  const onAction = label => {
    switch (label) {
      case CANCEL:
        closeModal(false)
        return

      case SAVE: {
        const conceptName = resolveConceptPrimaryName
          ? resolveConceptPrimaryName(selectedPhylogenyRoot)
          : selectedPhylogenyRoot
        saveAppPreference(phylogenyRootKey, conceptName).then(() => closeModal(true))
        return
      }
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'PhylogenyRootActions')
}

export default PhylogenyRootActions
