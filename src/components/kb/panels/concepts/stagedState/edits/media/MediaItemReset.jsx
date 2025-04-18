import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'
import EditReset from '../EditReset'

const MediaItemReset = ({ index }) => {
  const { stagedState, modifyConcept } = use(ConceptContext)

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

  return <EditReset onClick={onClick} />
}

export default MediaItemReset
