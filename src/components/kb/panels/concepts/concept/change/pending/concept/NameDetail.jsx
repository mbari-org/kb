import { use, useEffect } from 'react'

import { Box, Stack } from '@mui/material'
import FieldDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/FieldDetail'
import NameChangeExtent from '@/components/common/NameChangeExtent'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import UserContext from '@/contexts/user/UserContext'

import { useConceptNamePendingApproval } from '@/components/kb/panels/concepts/concept/change/pending/usePendingApproval'

import { isAdmin } from '@/lib/auth/role'

import { CONCEPT_NAME_EXTENT, PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL
const { NAME_ONLY } = CONCEPT_NAME_EXTENT

const NameDetail = ({ pendingField }) => {
  const { concept } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)
  const { user } = use(UserContext)

  const nameChangeType = modalData?.nameChangeType

  const pendingName = pendingField('ConceptName').find(name => name.newValue === concept.name)

  // Use the concept name approval hook that handles the shared field with aliases
  const conceptNameApproval = useConceptNamePendingApproval()

  useEffect(() => {
    setModalData(prevData => ({
      ...prevData,
      nameChangeType: NAME_ONLY,
    }))
  }, [setModalData])

  const handleNameChangeType = event => {
    setModalData(prevData => ({
      ...prevData,
      nameChangeType: event.target.value,
    }))
  }

  if (!pendingName) {
    return null
  }

  // Enable extent when concept name is approved (either specifically or via ALL)
  const enableExtent = conceptNameApproval === PENDING.APPROVAL.ACCEPT
  const isAdminUser = isAdmin(user)

  // Custom approval function for FieldDetail that uses concept name approval logic
  const pendingFieldApproval = fieldId => {
    return fieldId === pendingName.id && conceptNameApproval !== OTHER
  }

  return (
    <Stack direction='column' spacing={0}>
      <FieldDetail
        key={pendingName.id}
        pendingField={pendingName}
        pendingFieldApproval={pendingFieldApproval}
      />
      {isAdminUser && (
        <Box sx={{ ml: 16 }}>
          <NameChangeExtent
            disabled={!enableExtent}
            nameChangeType={nameChangeType}
            onChange={handleNameChangeType}
          />
        </Box>
      )}
    </Stack>
  )
}

export default NameDetail
