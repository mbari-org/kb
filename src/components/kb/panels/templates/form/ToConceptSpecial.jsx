import { FormControl, FormControlLabel, Radio, RadioGroup, IconButton } from '@mui/material'
import { IoClose } from 'react-icons/io5'
import theme from '@/lib/theme'

const ToConceptSpecial = ({ value, onChange }) => {
  const handleChange = event => {
    onChange(event.target.value)
  }

  const handleClear = () => {
    onChange(null)
  }

  return (
    <FormControl>
      <RadioGroup row value={value || ''} onChange={handleChange}>
        {value && (
          <IconButton
            size='small'
            onClick={handleClear}
            sx={{
              mr: 1,
              '&:hover': {
                ...theme.kb.icon.hover,
                color: theme.concept.color.remove,
              },
            }}
          >
            <IoClose size={16} />
          </IconButton>
        )}
        <FormControlLabel value='self' control={<Radio size='small' />} label='self' />
        <FormControlLabel value='nil' control={<Radio size='small' />} label='nil' />
      </RadioGroup>
    </FormControl>
  )
}

export default ToConceptSpecial
