import { CiEdit } from 'react-icons/ci'

import AliasActionButton from '../AliasActionButton'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'

const AliasEdit = ({ aliasIndex }) => {
  return (
    <AliasActionButton
      action={CONCEPT_STATE.ALIAS.EDIT}
      aliasIndex={aliasIndex}
      color='edit'
      Icon={props => <CiEdit {...props} size={20} />}
    />
  )
}

export default AliasEdit
