import { use } from 'react'

import { Box } from '@mui/material'

import KBTooltip from '@/components/common/tooltip/KBTooltip'

import ConfigContext from '@/contexts/config/ConfigContext'

import { DSG } from '@/lib/config/constants/dsg.js'

import CONFIG from '@/lib/config'

const { TOOLTIP } = CONFIG.PANELS.CONCEPTS.PANEL

const DsgLink = ({ concept }) => {
  const { dsgBaseUrl } = use(ConfigContext)

  const createDsgLink = concept =>
    `${dsgBaseUrl.replace(/\/*$/, '/')}${DSG.CONCEPT_VIEW_PATH}${encodeURIComponent(concept.name)}`

  if (!dsgBaseUrl || !concept?.name) {
    return concept?.name
  }

  return (
    <KBTooltip title={TOOLTIP.DSG}>
      <Box
        component='a'
        href={createDsgLink(concept)}
        rel='noopener noreferrer'
        sx={{
          color: 'inherit',
          font: 'inherit',
          textDecoration: 'none',
          '&:hover': { fontStyle: 'italic' },
        }}
        target='_blank'
      >
        {concept.name}
      </Box>
    </KBTooltip>
  )
}

export default DsgLink
