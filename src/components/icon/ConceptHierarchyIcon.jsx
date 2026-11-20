import { CiEdit } from 'react-icons/ci'

import ActionIcon from '@/components/icon/ActionIcon'
import CONFIG from '@/lib/config'

const ConceptHierarchyIcon = ({ onClick, sx = {} }) => {
  return (
    <ActionIcon
      Icon={CiEdit}
      onClick={onClick}
      size={24}
      iconAction='EDIT'
      sx={{
        mb: 2,
        ml: 0.5,
        padding: 0,
        ...sx,
      }}
      tooltip={CONFIG.UI.ICON.CONCEPT_HIERARCHY}
    />
  )
}

export default ConceptHierarchyIcon
