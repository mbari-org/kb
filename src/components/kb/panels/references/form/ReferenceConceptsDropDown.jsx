import { Menu, MenuItem, ListSubheader } from '@mui/material'

const ReferenceConceptsDropDown = ({ anchorEl, onClose, concepts, onConceptClick }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      slotProps={{
        paper: {
          style: {
            maxHeight: 300,
            width: anchorEl?.offsetWidth,
          },
        },
      }}
    >
      <ListSubheader
        sx={{
          py: 1,
          px: 2,
          color: 'text.secondary',
          fontWeight: 'bold',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        Select a concept to remove from the list
      </ListSubheader>
      {concepts?.map(concept => (
        <MenuItem key={concept} onClick={() => onConceptClick(concept)}>
          {concept}
        </MenuItem>
      ))}
    </Menu>
  )
}

export default ReferenceConceptsDropDown
