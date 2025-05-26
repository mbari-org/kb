import { use, useState, useEffect } from 'react'

import { Stack } from '@mui/material'
import FieldDetail from '@/components/kb/panels/concept/change/pending/concept/FieldDetail'
import NameChangeExtent from '@/components/common/NameChangeExtent'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { LABELS } from '@/lib/constants'

const { NAME_ONLY, ASSOCIATED_DATA } = LABELS.CONCEPT.CHANGE_NAME

const NameDetail = ({ pendingField }) => {
  const { concept } = use(ConceptContext)
  const { modalData, setModalData } = use(ModalContext)

  const [nameChangeType, setNameChangeType] = useState(NAME_ONLY)

  const pendingName = pendingField('ConceptName').find(name => name.newValue === concept.name)

  useEffect(() => {
    setModalData(prevData => ({
      ...prevData,
      nameChangeType: NAME_ONLY,
    }))
  }, [setModalData])

  const handleNameChangeType = event => {
    setNameChangeType(event.target.value)
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
      <NameChangeExtent nameChangeType={nameChangeType} onChange={handleNameChangeType} />
    </Stack>
  )
}

export default NameDetail
