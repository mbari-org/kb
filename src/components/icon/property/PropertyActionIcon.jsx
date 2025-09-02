import ActionIcon from '@/components/icon/ActionIcon'

const PropertyActionIcon = ({ color, Icon, onClick, size = 24, tooltip, sx = {} }) => {
  return (
    <ActionIcon
      Icon={Icon}
      onClick={onClick}
      size={size}
      color={color}
      tooltip={tooltip}
      asDiv={true}
      sx={{
        position: 'static',
        zIndex: 1,
        ...sx,
      }}
    />
  )
}

export default PropertyActionIcon
