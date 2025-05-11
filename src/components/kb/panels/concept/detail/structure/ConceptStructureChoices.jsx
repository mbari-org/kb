import { Box, Button, IconButton, Modal, Stack } from '@mui/material'
import { IoClose } from 'react-icons/io5'

import useAddChild from '@/components/kb/panels/concept/detail/structure/child/useAddChild'
import useChangeName from '@/components/kb/panels/concept/detail/structure/name/useChangeName'
import useChangeParent from '@/components/kb/panels/concept/detail/structure/parent/useChangeParent'
import useDeleteConcept from '@/components/kb/panels/concept/detail/structure/concept/useDeleteConcept'

import useStructureChoices from '@/components/kb/panels/concept/detail/structure/useStructureChoices'

const ChangeStructureChoices = ({ closeChoices }) => {
  const { disableDelete, disableChangeName, disableChangeParent } = useStructureChoices()

  const addChild = useAddChild(closeChoices)
  const changeName = useChangeName(closeChoices)
  const changeParent = useChangeParent(closeChoices)
  const deleteConcept = useDeleteConcept(closeChoices)

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
