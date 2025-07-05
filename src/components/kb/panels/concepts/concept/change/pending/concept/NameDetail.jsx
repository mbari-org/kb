import { use, useEffect } from 'react'

import { Box, Stack } from '@mui/material'
import FieldDetail from '@/components/kb/panels/concepts/concept/change/pending/concept/FieldDetail'
import NameChangeExtent from '@/components/common/NameChangeExtent'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import UserContext from '@/contexts/user/UserContext'

import { useFieldPendingApproval } from '@/components/kb/panels/concepts/concept/change/pending/usePendingApproval'

import { isAdmin } from '@/lib/auth/role'

import { LABELS, PENDING } from '@/lib/constants'

const { APPROVAL } = PENDING
const { NAME_ONLY } = LABELS.CONCEPT.CHANGE_NAME

const NameDetail = ({ pendingField }) => {
  const { concept } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)
  const { user } = use(UserContext)

  const nameChangeType = modalData?.nameChangeType

  const pendingName = pendingField('ConceptName').find(name => name.newValue === concept.name)

  // Use the specific field approval for this concept name field (or null if no pending name)
  const conceptNameApproval = useFieldPendingApproval(pendingName?.id)

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
  const enableExtent = conceptNameApproval === APPROVAL.ACCEPT && isAdmin(user)

  return (
    <Stack direction='column' spacing={0}>
      <FieldDetail key={pendingName.id} pendingField={pendingName} />
      <Box sx={{ ml: 16 }}>
        <NameChangeExtent
          disabled={!enableExtent}
          nameChangeType={nameChangeType}
          onChange={handleNameChangeType}
        />
      </Box>
    </Stack>
  )
}

export default NameDetail
