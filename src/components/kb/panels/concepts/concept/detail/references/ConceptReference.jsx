import { Box, Typography } from '@mui/material'

import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'

import CONFIG from '@/lib/config'

const ConceptReference = ({ reference }) => {
  if (!reference) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'block',
        width: '100%',
        minWidth: 0,
        pl: 1,
        pr: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
      title={reference.citation}
    >
      <KBTooltipTarget
        title={CONFIG.PANELS.CONCEPTS.REFERENCES.CITATION.TOOLTIP}
        placement='top-start'
        wrapperSx={{ display: 'block', width: '100%' }}
      >
        <Typography
          component='a'
          href={reference.doi}
          noWrap
          rel='noopener noreferrer'
          sx={{
            color: 'text.primary',
            cursor: 'pointer',
            display: 'block',
            textDecoration: 'none',
            '&:hover': {
              color: 'primary.main',
              textDecoration: 'none',
            },
          }}
          target='_blank'
          title={reference.citation}
        >
          {reference.citation}
        </Typography>
      </KBTooltipTarget>
    </Box>
  )
}

export default ConceptReference
