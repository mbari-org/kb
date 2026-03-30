import { use } from 'react'
import { Stack, TextField } from '@mui/material'

import Title from '@/components/common/factory/Title'
import { createActions } from '@/components/common/factory/createComponent'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import CONFIG from '@/text'

const { CLOSE } = CONFIG.PANELS.CONCEPTS.MODALS.BUTTON

const ConceptRealizationModalTitle = () => <Title title='Realization' />

const ConceptRealizationModalContent = () => {
  const { modalData } = use(ConceptModalContext)

  const realization = modalData?.realization || {}
  const infoStyle = {
    fullWidth: true,
    InputProps: { readOnly: true },
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
        label='Link Name'
        minRows={1}
        multiline
        sx={wrappedFieldSx}
        value={realization.linkName || ''}
      />
      <TextField
        {...infoStyle}
        label='To Concept'
        minRows={1}
        multiline
        sx={wrappedFieldSx}
        value={realization.toConcept || ''}
      />
      <TextField
        {...infoStyle}
        label='Link Value'
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

export {
  ConceptRealizationModalActions,
  ConceptRealizationModalContent,
  ConceptRealizationModalTitle,
}
