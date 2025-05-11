import { MdOutlinePlaylistAdd } from 'react-icons/md'

import AliasActionButton from '../AliasActionButton'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'

const AliasAdd = ({ aliasIndex }) => {
  return (
    <AliasActionButton
      action={CONCEPT_STATE.ALIAS.ADD}
      aliasIndex={aliasIndex}
      color='add'
      Icon={props => <MdOutlinePlaylistAdd {...props} size={24} />}
      sx={{
        mb: 1,
      }}
    />
  )
}

export default AliasAdd
