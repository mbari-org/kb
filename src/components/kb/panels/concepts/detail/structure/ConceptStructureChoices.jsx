import { use, useMemo } from 'react'

import { Box, Button, IconButton, Modal, Stack } from '@mui/material'
import { IoClose } from 'react-icons/io5'

import useAddChild from '@/components/kb/panels/concepts/detail/structure/child/useAddChild'
import useChangeName from '@/components/kb/panels/concepts/detail/structure/name/useChangeName'
import useChangeParent from '@/components/kb/panels/concepts/detail/structure/parent/useChangeParent'
import useDeleteConcept from '@/components/kb/panels/concepts/detail/structure/concept/useDeleteConcept'

import ConceptContext from '@/contexts/concept/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { hasPendingHistory } from '@/lib/kb/util/pendingHistory'
import { hasStateChange } from '@/contexts/concept/lib/edit/stateChange'

const ChangeStructureChoices = ({ closeChoices }) => {
  const { concept, initialState, stagedState, pendingHistory } = use(ConceptContext)
  const { taxonomyRoot } = use(TaxonomyContext)

  const isRoot = concept.name === taxonomyRoot.name
  const nameHasPendingHistory = hasPendingHistory(pendingHistory, 'ConceptName')

  const conceptHasChildren = concept.children.length > 0 || stagedState.children.length > 0
  const conceptHasNameUpdate = !!stagedState.nameChange
  const conceptHasParentUpdate = stagedState.parentName !== concept.parent?.name

  const addChild = useAddChild(closeChoices)
  const changeName = useChangeName()
  const changeParent = useChangeParent()
  const deleteConcept = useDeleteConcept(closeChoices)

  const disableChangeName = isRoot || nameHasPendingHistory || conceptHasNameUpdate
  const disableChangeParent = isRoot || conceptHasParentUpdate
  const disableDelete = useMemo(
    () => isRoot || conceptHasChildren || hasStateChange(initialState, stagedState),
    [conceptHasChildren, initialState, isRoot, stagedState]
  )

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

        <Stack spacing={5} mt={3}>
          <Stack spacing={2.5}>
            <Button
              variant='contained'
              color='primary'
              disabled={disableChangeName}
              onClick={() => {
                closeChoices()
                changeName()
              }}
            >
              Change Name
            </Button>
            <Button
              variant='contained'
              color='primary'
              disabled={disableChangeParent}
              onClick={() => {
                closeChoices()
                changeParent()
              }}
            >
              Change Parent
            </Button>
            <Button variant='contained' color='primary' onClick={addChild}>
              Add Child
            </Button>
          </Stack>
          <Button
            variant='contained'
            color='error'
            disabled={disableDelete}
            onClick={deleteConcept}
          >
            Delete Concept
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}

export default ChangeStructureChoices
