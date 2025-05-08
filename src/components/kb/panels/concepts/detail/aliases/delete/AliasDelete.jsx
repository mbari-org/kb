import { MdOutlineDeleteForever } from 'react-icons/md'

import AliasActionButton from '../AliasActionButton'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'

const AliasDelete = ({ aliasIndex }) => {
  return (
    <AliasActionButton
      action={CONCEPT_STATE.ALIAS.DELETE}
      aliasIndex={aliasIndex}
      color='remove'
      Icon={props => <MdOutlineDeleteForever {...props} size={20} />}
    />
  )
}

export default AliasDelete
