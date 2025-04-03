import { use, useEffect, useState } from 'react'

import { Box, Stack, Typography } from '@mui/material'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/concept/ConceptContext'

import { countAnnotations } from '@/lib/services/api/annosaurus/annotations'

const DeleteConceptContent = () => {
  const { apiFns } = use(ConfigContext)
  const { concept } = use(ConceptContext)

  const [annotationCount, setAnnotationCount] = useState(0)

  useEffect(() => {
    apiFns.apiPayload(countAnnotations, concept.name).then(annotations => {
      setAnnotationCount(annotations.length)
    })
  }, [apiFns, concept.name])

  return (
    <Box>
      <Typography align='center' color='cancel' variant='h5' sx={{ mt: 1, mb: 2 }}>
        WARNING
      </Typography>
      <Stack direction='column' spacing={0.5} alignItems='center'>
        <Typography align='center'>Be sure you really want to delete this concept.</Typography>
        <Typography align='center'>
          Nancy has a ruler and will crack your knuckles if you mess this up.
        </Typography>
        <Typography align='center'>
          And BTW, this concept has {annotationCount} annotations.
        </Typography>
      </Stack>
    </Box>
  )
}

export default DeleteConceptContent
