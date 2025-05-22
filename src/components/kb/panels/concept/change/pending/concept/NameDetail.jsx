import { use, useState, useEffect } from 'react'

import { FormControlLabel, Radio, Stack } from '@mui/material'
import FieldDetail from '@/components/kb/panels/concept/change/pending/concept/FieldDetail'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import { PENDING } from '@/lib/constants'

const { NAME_ONLY, ASSOCIATED_DATA } = PENDING.CHANGE_NAME

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
      <Stack direction='row' sx={{ ml: 8 }}>
        <FormControlLabel
          control={
            <Radio
              name='nameChangeType'
              value={NAME_ONLY}
              checked={nameChangeType === NAME_ONLY}
              onChange={handleNameChangeType}
            />
          }
          label={NAME_ONLY}
        />
        <FormControlLabel
          control={
            <Radio
              name='nameChangeType'
              value={ASSOCIATED_DATA}
              checked={nameChangeType === ASSOCIATED_DATA}
              onChange={handleNameChangeType}
            />
          }
          label={ASSOCIATED_DATA}
        />
      </Stack>
    </Stack>
  )
}

export default NameDetail
