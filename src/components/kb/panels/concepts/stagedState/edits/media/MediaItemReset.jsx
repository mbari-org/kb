import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'
import EditReset from '../EditReset'

const MediaItemReset = ({ index }) => {
  const { confirmDiscard, modifyConcept, stagedState } = use(ConceptContext)

  const resetting =
    confirmDiscard?.type === CONCEPT_STATE.RESET.MEDIA ||
    (confirmDiscard?.type === CONCEPT_STATE.RESET.MEDIA_ITEM &&
      confirmDiscard?.update?.index === index) ||
    confirmDiscard?.type === CONCEPT_STATE.RESET.TO_INITIAL

  const onClick = () => {
    // CxTBD Check if this is the only media item edit left, and if so, do RESET.MEDIA
    const count = stagedState.media.filter(item => item.action !== CONCEPT_STATE.NO_ACTION).length
    count === 1
      ? modifyConcept({ type: CONCEPT_STATE.RESET.MEDIA })
      : modifyConcept({
          type: CONCEPT_STATE.RESET.MEDIA_ITEM,
          update: { index },
        })
  }

  return <EditReset disabled={confirmDiscard} onClick={onClick} resetting={resetting} />
}

export default MediaItemReset
