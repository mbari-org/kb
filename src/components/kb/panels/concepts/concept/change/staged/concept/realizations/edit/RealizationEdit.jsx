import { CiEdit } from 'react-icons/ci'

import RealizationActionButton from '../RealizationActionButton'

import { CONCEPT_STATE } from '@/lib/constants'

const RealizationEdit = ({ realizationIndex }) => {
  return (
    <RealizationActionButton
      action={CONCEPT_STATE.REALIZATION.EDIT}
      realizationIndex={realizationIndex}
      color='edit'
      Icon={props => <CiEdit {...props} size={20} />}
    />
  )
}

export default RealizationEdit
