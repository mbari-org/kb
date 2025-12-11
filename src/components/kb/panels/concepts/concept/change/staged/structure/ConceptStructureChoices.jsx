import { use } from 'react'
import { Box, IconButton, Modal, Stack } from '@mui/material'
import { IoCloseSharp } from 'react-icons/io5'

import StructureChoiceButton from './StructureChoiceButton'

import useAddChildModal from '@/components/kb/panels/concepts/concept/change/staged/children/useAddChildModal'
import useChangeNameModal from '@/components/kb/panels/concepts/concept/change/staged/name/change/useChangeNameModal'
import useChangeParentModal from '@/components/kb/panels/concepts/concept/change/staged/parent/useChangeParentModal'
import useDeleteConceptModal from '@/components/kb/panels/concepts/concept/change/staged/name/delete/useDeleteConceptModal'

import useStructureChoices from '@/components/kb/panels/concepts/concept/change/staged/structure/useStructureChoices'

import AppModalContext from '@/contexts/app/AppModalContext'
import CONFIG from '@/config'

const { CONCEPT, PROCESSING } = CONFIG

const ChangeStructureChoices = ({ closeChoices }) => {
  const { disableDelete, disableChangeName, disableChangeParent } = useStructureChoices()
  const { setProcessing } = use(AppModalContext)

  const addChild = useAddChildModal()
  const changeName = useChangeNameModal()
  const changeParent = useChangeParentModal()
  const deleteConcept = useDeleteConceptModal()

  const handleClick = (structureFn, processingArg = null) => async event => {
    event.preventDefault()
    closeChoices()

    if (processingArg) {
      setProcessing(PROCESSING.LOAD, processingArg)
      await structureFn()
      setProcessing(PROCESSING.OFF)
      return
    }

    structureFn()
  }

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
          <IoCloseSharp size={24} />
        </IconButton>

        <Stack spacing={5} mt={3}>
          <Stack spacing={2.5}>
            <StructureChoiceButton
              disabled={disableChangeName}
              onClick={handleClick(changeName)}
              text={CONCEPT.STRUCTURE.CHANGE_NAME}
            />
            <StructureChoiceButton
              disabled={disableChangeParent}
              onClick={handleClick(changeParent, PROCESSING.ARG.CONCEPT_DESCENDANTS)}
              text={CONCEPT.STRUCTURE.CHANGE_PARENT}
            />
            <StructureChoiceButton
              disabled={false}
              onClick={handleClick(addChild)}
              text={CONCEPT.STRUCTURE.ADD_CHILD}
            />
          </Stack>
          <StructureChoiceButton
            color='cancel'
            disabled={disableDelete}
            onClick={handleClick(deleteConcept, PROCESSING.ARG.CONCEPT_DEPENDENCIES)}
            text={CONCEPT.STRUCTURE.DELETE_CONCEPT}
          />
        </Stack>
      </Box>
    </Modal>
  )
}

export default ChangeStructureChoices
