import { use, useCallback, useRef } from 'react'

import ChangeParentActions from './ChangeParentActions'
import ChangeParentContent from './ChangeParentContent'
import ConceptTitle from '@/components/common/ConceptTitle'

import { createModal } from '@/components/modal/conceptModalFactory'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { getDescendantNames } from '@/lib/kb/model/concept'

import { CONCEPT_STATE } from '@/constants/conceptState.js'

const { RESET } = CONCEPT_STATE

const initialModalData = {
  action: CONCEPT_STATE.PARENT,
  modified: false,
  parent: '',
}

const changeParentModal = omitChoices => {
  const components = {
    Actions: ChangeParentActions,
    Content: () => <ChangeParentContent omitChoices={omitChoices} />,
    Title: ConceptTitle,
  }
  return createModal(components)
}

const changeParentOnClose = modifyConcept => {
  return modalData => {
    if (modalData.modified) {
      modifyConcept({
        type: RESET.PARENT,
        update: {
          name: modalData.name,
        },
      })
      return false
    }
    return true
  }
}

const useChangeParentModal = () => {
  const { apiFns } = use(ConfigContext)
  const { concept, modifyConcept } = use(ConceptContext)
  const { setModal, setModalData } = use(ConceptModalContext)

  const alreadyGettingDescendants = useRef(false)

  return useCallback(async () => {
    if (!concept || alreadyGettingDescendants.current) return

    try {
      alreadyGettingDescendants.current = true

      const descendantNames = await getDescendantNames(apiFns, concept.name)
      const omitChoices = [concept.name, concept.parent, ...descendantNames]

      const modal = changeParentModal(omitChoices)
      const onClose = changeParentOnClose(modifyConcept)

      setModal(modal, onClose)
      setModalData(initialModalData)
    } catch (error) {
      throw new Error(`Failed to load descendants: ${error}`)
    } finally {
      alreadyGettingDescendants.current = false
    }
  }, [apiFns, concept, modifyConcept, setModal, setModalData])
}

export default useChangeParentModal
