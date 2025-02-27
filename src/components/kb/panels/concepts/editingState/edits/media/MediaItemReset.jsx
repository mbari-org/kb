import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept_state'
import EditReset from '../EditReset'

const MediaItemReset = ({ mediaIndex }) => {
  const { editingState, modifyConcept } = use(ConceptContext)

  const onClick = () => {
    // CxTBD Check if this is the only media edit, and if so, do MEDIA.RESET
    const count = editingState.media.filter(item => item.action !== CONCEPT_STATE.NO_ACTION).length
    count === 1
      ? modifyConcept({ type: CONCEPT_STATE.MEDIA.RESET })
      : modifyConcept({
          type: CONCEPT_STATE.MEDIA.RESET_ITEM,
          update: { mediaIndex },
        })
  }

  return <EditReset onClick={onClick} />
}

export default MediaItemReset
