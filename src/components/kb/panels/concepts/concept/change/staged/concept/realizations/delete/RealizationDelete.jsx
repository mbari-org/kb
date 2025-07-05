import { MdOutlineDeleteForever } from 'react-icons/md'

import RealizationActionButton from '../RealizationActionButton'

import { CONCEPT_STATE } from '@/lib/constants'

const RealizationDelete = ({ realizationIndex }) => {
  return (
    <RealizationActionButton
      action={CONCEPT_STATE.REALIZATION.DELETE}
      realizationIndex={realizationIndex}
      color='remove'
      Icon={props => <MdOutlineDeleteForever {...props} size={20} />}
    />
  )
}

export default RealizationDelete
