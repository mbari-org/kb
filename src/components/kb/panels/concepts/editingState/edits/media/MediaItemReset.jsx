import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'
import EditReset from '../EditReset'

const MediaItemReset = ({ mediaIndex }) => {
  const { editingState, modifyConcept } = use(ConceptContext)

  const onClick = () => {
    // CxTBD Check if this is the only media edit, and if so, do RESET.MEDIA
    const count = editingState.media.filter(item => item.action !== CONCEPT_STATE.NO_ACTION).length
    count === 1
      ? modifyConcept({ type: CONCEPT_STATE.RESET.MEDIA })
      : modifyConcept({
          type: CONCEPT_STATE.RESET.MEDIA_ITEM,
          update: { mediaIndex },
        })
  }

  return <EditReset onClick={onClick} />
}

export default MediaItemReset
