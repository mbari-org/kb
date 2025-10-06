import { LuFilter } from 'react-icons/lu'
import ActionIcon from './ActionIcon'

const FilterIcon = ({ onClick, tooltip, asDiv = false, ...props }) => {
  return <ActionIcon Icon={LuFilter} onClick={onClick} tooltip={tooltip} asDiv={asDiv} {...props} />
}

export default FilterIcon
