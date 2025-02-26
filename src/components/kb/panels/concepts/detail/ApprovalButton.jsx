import { use } from 'react'
import { PiStamp } from 'react-icons/pi'
import { IconButton } from '@mui/material'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { useTheme } from '@mui/material/styles'

const ApprovalButton = ({ field }) => {
  const theme = useTheme()

  const { pendingFieldDisplay } = use(ConceptContext)

  return (
    <IconButton
      color='main'
      sx={{
        backgroundColor: theme.palette.main.main,
        '&:hover': {
          ...theme.kb.icon.hover,
        },
        mb: 2,
        padding: 0,
      }}
      onClick={() => pendingFieldDisplay(field)}
    >
      <PiStamp size={24} />
    </IconButton>
  )
}

export default ApprovalButton
