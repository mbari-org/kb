import { CiEdit } from 'react-icons/ci'

import ActionIcon from '@/components/icon/ActionIcon'

const ConceptHierarchyIcon = ({ onClick, sx = {} }) => {
  return (
    <ActionIcon
      Icon={CiEdit}
      onClick={onClick}
      size={24}
      color='edit'
      colorOnHover
      sx={{
        mb: 2,
        ml: 0.5,
        padding: 0,
        ...sx,
      }}
      tooltip='Edit Concept Hierarchy'
    />
  )
}

export default ConceptHierarchyIcon
