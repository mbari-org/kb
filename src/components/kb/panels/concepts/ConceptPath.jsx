import { use } from 'react'
import { Breadcrumbs, Button } from '@mui/material'
import { MdNavigateNext } from 'react-icons/md'

import ConceptContext from '@/contexts/concept/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

const ConceptPath = () => {
  const { conceptPath } = use(ConceptContext)
  const { panel, select } = use(SelectedContext)

  return (
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
            select({ concept: path })
            panel.push('Concepts')
          }}
        >
          {path}
        </Button>
      ))}
    </Breadcrumbs>
  )
}

export default ConceptPath
