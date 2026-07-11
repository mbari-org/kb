import { use } from 'react'
import { Box } from '@mui/material'

import ConceptMedia from '@/components/kb/panels/concepts/concept/detail/ConceptMedia'
import ConceptName from '@/components/kb/panels/concepts/concept/detail/ConceptName'
import ConceptAuthor from '@/components/kb/panels/concepts/concept/detail/ConceptAuthor'
import ConceptRank from '@/components/kb/panels/concepts/concept/detail/ConceptRank'
import ConceptAliases from '@/components/kb/panels/concepts/concept/detail/ConceptAliases'
import ConceptRealizations from '@/components/kb/panels/concepts/concept/detail/ConceptRealizations'
import ConceptReferences from '@/components/kb/panels/concepts/concept/detail/ConceptReferences'
import ConceptTemplates from '@/components/kb/panels/concepts/concept/detail/ConceptTemplates'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const ConceptView = () => {
  const { isPhylogenyRoot } = use(ConceptContext)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 1.5,
        flex: 1,
        minHeight: 0,
        paddingBottom: '120px',
        overflow: 'hidden',
      }}
    >
      <ConceptMedia />
      <Box
        sx={{
          display: 'flex',
          flex: '1',
          flexDirection: 'column',
          gap: 2,
          minHeight: 0,
          minWidth: 0,
          ml: 1,
          mr: 1,
          textAlign: 'left',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ConceptName />
          <ConceptAuthor />
          {isPhylogenyRoot && <ConceptRank />}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            gap: 2,
            minHeight: 0,
            minWidth: 0,
            mt: 4,
            overflowY: 'auto',
            pr: 1,
          }}
        >
          <ConceptAliases />
          <ConceptReferences />
          <ConceptTemplates />
          <ConceptRealizations />
        </Box>
      </Box>
    </Box>
  )
}

export default ConceptView
