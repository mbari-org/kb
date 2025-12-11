import { Menu, MenuItem, ListSubheader } from '@mui/material'

import CONFIG from '@/config'

const ReferenceConceptsDropDown = ({ anchorEl, onClose, concepts, onConceptClick }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      onClose={onClose}
      open={Boolean(anchorEl)}
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
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.secondary',
          fontWeight: 'bold',
          px: 2,
          py: 1,
        }}
      >
        {CONFIG.PANELS.REFERENCES.MODALS.ADD_CONCEPT.SELECT_REMOVE}
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
