import { use } from 'react'
import { Box, Breadcrumbs, Button } from '@mui/material'
import { MdNavigateNext } from 'react-icons/md'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants/selected.js'

const ConceptPath = () => {
  const { conceptPath } = use(ConceptContext)
  const { updateSelected } = use(SelectedContext)

  const handlePathClick = path => {
    updateSelected({ [SELECTED.CONCEPT]: path, [SELECTED.PANEL]: SELECTED.PANELS.CONCEPTS })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Breadcrumbs
        maxItems={Infinity}
        separator={<MdNavigateNext fontSize='large' />}
        sx={{
          '& .MuiBreadcrumbs-separator': { mx: 0 },
          '& .MuiButton-root': {
            padding: '0px',
            minWidth: 'auto',
            textTransform: 'none',
          },
          height: theme => `${theme.typography.fontSize * 3}px`,
          display: 'flex',
        }}
      >
        {conceptPath?.map((path, index) => (
          <Button
            key={index}
            color={index === conceptPath.length - 1 ? 'primary' : 'inherit'}
            onClick={() => {
              if (index === conceptPath.length - 1) return
              handlePathClick(path)
            }}
          >
            {path}
          </Button>
        ))}
      </Breadcrumbs>
    </Box>
  )
}

export default ConceptPath
