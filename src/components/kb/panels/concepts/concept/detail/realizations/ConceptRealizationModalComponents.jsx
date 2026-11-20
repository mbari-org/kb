import { use } from 'react'
import { Stack, TextField } from '@mui/material'

import Title from '@/components/common/factory/Title'
import { createActions } from '@/components/common/factory/createComponent'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'

import CONFIG from '@/lib/config'

const { CLOSE } = CONFIG.BUTTON

const ConceptRealizationModalTitle = () => <Title title='Realization' />

const ConceptRealizationModalContent = () => {
  const { modalData } = use(ConceptModalDataContext)

  const realization = modalData?.realization || {}
  const infoStyle = {
    disabled: true,
    fullWidth: true,
    variant: 'outlined',
  }
  const wrappedFieldSx = {
    '& .MuiInputBase-inputMultiline': {
      overflowWrap: 'anywhere',
      whiteSpace: 'pre-wrap',
    },
  }

  return (
    <Stack spacing={2} sx={{ pt: 1 }}>
      <TextField
        {...infoStyle}
        label={CONFIG.LINK.FIELDS.LINK_NAME}
        minRows={1}
        multiline
        sx={wrappedFieldSx}
        value={realization.linkName || ''}
      />
      <TextField
        {...infoStyle}
        label={CONFIG.LINK.FIELDS.TO_CONCEPT}
        minRows={1}
        multiline
        sx={wrappedFieldSx}
        value={realization.toConcept || ''}
      />
      <TextField
        {...infoStyle}
        label={CONFIG.LINK.FIELDS.LINK_VALUE}
        minRows={1}
        multiline
        sx={wrappedFieldSx}
        value={realization.linkValue || ''}
      />
    </Stack>
  )
}

const ConceptRealizationModalActions = () => {
  const { closeModal } = use(ConceptModalContext)

  const handleAction = async () => {
    closeModal(true)
  }

  return createActions(
    {
      colors: ['main'],
      disabled: [false],
      labels: [CLOSE],
      onAction: handleAction,
    },
    'ConceptRealizationModalActions'
  )
}

export { ConceptRealizationModalActions, ConceptRealizationModalContent, ConceptRealizationModalTitle }
