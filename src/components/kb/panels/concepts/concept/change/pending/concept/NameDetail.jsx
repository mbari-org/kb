import { use, useEffect } from 'react'

import { Box, Stack } from '@mui/material'
import FieldDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/FieldDetail'
import NameChangeExtent from '@/components/common/NameChangeExtent'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import HOLDModalContext from '@/contexts/modal/panel/HOLDModalContext'

import { LABELS } from '@/lib/constants'

const { NAME_ONLY } = LABELS.CONCEPT.CHANGE_NAME

const NameDetail = ({ pendingField }) => {
  const { concept } = use(ConceptContext)
  const { modalData, setModalData } = use(HOLDModalContext)

  const nameChangeType = modalData?.nameChangeType

  const pendingName = pendingField('ConceptName').find(name => name.newValue === concept.name)

  useEffect(() => {
    setModalData(prevData => ({
      ...prevData,
      nameChangeType: NAME_ONLY,
    }))
  }, [setModalData])

  const handleNameChangeType = event => {
    setModalData({
      ...modalData,
      nameChangeType: event.target.value,
    })
  }

  if (!pendingName) {
    return null
  }

  return (
    <Stack direction='column' spacing={0}>
      <FieldDetail key={pendingName.id} pendingField={pendingName} />
      <Box sx={{ ml: 8 }}>
        <NameChangeExtent nameChangeType={nameChangeType} onChange={handleNameChangeType} />
      </Box>
    </Stack>
  )
}

export default NameDetail
