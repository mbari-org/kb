import { use } from 'react'

import { Modal, Box, Button, IconButton, Stack } from '@mui/material'
import { IoClose } from 'react-icons/io5'

import useChangePrimaryName from '@/components/kb/panels/concepts/detail/primaryName/useChangePrimaryName'
import useChangeParent from '@/components/kb/panels/concepts/detail/structure/parent/useChangeParent'

import ConceptContext from '@/contexts/concept/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { hasPendingHistory } from '@/lib/kb/util/pendingHistory'

const ChangeStructureChoices = ({ closeChoices }) => {
  const { concept, stagedState, pendingHistory } = use(ConceptContext)
  const { getRoot } = use(TaxonomyContext)

  const isRoot = concept.name === getRoot().name
  const nameHasPendingHistory = hasPendingHistory(pendingHistory, 'ConceptName')

  const conceptHasChildren = concept.children.length > 0
  const conceptHasNameUpdate = stagedState.name !== concept.name
  const conceptHasParentUpdate = stagedState.parentName !== concept.parent?.name

  const changePrimaryName = useChangePrimaryName()
  const changeParent = useChangeParent()

  return (
    <Modal open={true} onClose={closeChoices}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 3,
          left: '50%',
          minWidth: 200,
          p: 2,
          position: 'absolute',
          top: '25%',
          transform: 'translate(-50%, -25%)',
          zIndex: 1000,
        }}
      >
        <IconButton
          onClick={closeChoices}
          sx={{
            p: 0,
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <IoClose size={24} />
        </IconButton>

        <Stack spacing={2.5} mt={3}>
          <Button
            variant='contained'
            color='primary'
            disabled={isRoot || nameHasPendingHistory || conceptHasNameUpdate}
            onClick={() => {
              closeChoices()
              changePrimaryName()
            }}
          >
            Change Name
          </Button>
          <Button
            variant='contained'
            color='primary'
            disabled={isRoot || conceptHasParentUpdate}
            onClick={() => {
              closeChoices()
              changeParent()
            }}
          >
            Change Parent
          </Button>
          <Button variant='contained' color='primary'>
            Add Child
          </Button>
          <Button variant='contained' color='error' disabled={isRoot || conceptHasChildren}>
            Delete Concept
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}

export default ChangeStructureChoices
