import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ResettingButton from '@/components/kb/panels/concept/change/ResettingButton'

import { mediaResetting } from '@/components/kb/panels/concept/change/staged/concept/util'

import { CONCEPT_STATE, RESETTING } from '@/lib/constants'

const MediaReset = () => {
  const { confirmReset, modifyConcept } = use(ConceptContext)

  const resetting = mediaResetting(confirmReset) === RESETTING.ME

  const onClick = () => {
    modifyConcept({ type: CONCEPT_STATE.RESET.MEDIA })
  }

  return (
    <ResettingButton
      color='cancel'
      disabled={confirmReset}
      onClick={onClick}
      resetting={resetting}
    />
  )
}

export default MediaReset
