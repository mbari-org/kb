import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'
import EditReset from '../EditReset'

const MediaItemReset = ({ mediaIndex }) => {
  const { editingState, modifyConcept } = use(ConceptContext)

  const onClick = () => {
    // CxTBD Check if this is the only media edit, and if so, do RESET_MEDIA
    const count = editingState.media.filter(item => item.action !== CONCEPT_STATE.NO_ACTION).length
    count === 1
      ? modifyConcept({ type: CONCEPT_STATE.RESET_MEDIA })
      : modifyConcept({
          type: CONCEPT_STATE.RESET_MEDIA_ITEM,
          update: { mediaIndex },
        })
  }

  return <EditReset onClick={onClick} />
}

export default MediaItemReset
