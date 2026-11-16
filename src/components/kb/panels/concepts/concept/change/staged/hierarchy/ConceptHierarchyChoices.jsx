import { use, useState } from 'react'
import { Box, IconButton, Modal, Stack } from '@mui/material'
import { IoCloseSharp } from 'react-icons/io5'

import HierarchyChoiceButton from './HierarchyChoiceButton'

import useAddChildModal from '@/components/kb/panels/concepts/concept/change/staged/children/useAddChildModal'
import useChangeNameModal from '@/components/kb/panels/concepts/concept/change/staged/name/change/useChangeNameModal'
import useChangeParentModal from '@/components/kb/panels/concepts/concept/change/staged/parent/useChangeParentModal'
import useDeleteConceptModal from '@/components/kb/panels/concepts/concept/change/staged/name/delete/useDeleteConceptModal'

import useHierarchyChoices from '@/components/kb/panels/concepts/concept/change/staged/hierarchy/useHierarchyChoices'

import AppModalContext from '@/contexts/app/AppModalContext'
import CONFIG from '@/lib/config'

const { CONCEPT, PROCESSING } = CONFIG

const ConceptHierarchyChoices = ({ closeChoices }) => {
  const [asyncError, setAsyncError] = useState(null)
  const {
    disableAddChild,
    disableAddChildReason,
    disableChangeName,
    disableChangeNameReason,
    disableChangeParent,
    disableChangeParentReason,
    disableDelete,
    disableDeleteReason,
  } = useHierarchyChoices()
  const { beginProcessing } = use(AppModalContext)

  const addChild = useAddChildModal()
  const changeName = useChangeNameModal()
  const changeParent = useChangeParentModal()
  const deleteConcept = useDeleteConceptModal()
  if (asyncError) {
    throw asyncError
  }

  const handleClick =
    (hierarchyFn, processingValue = null) =>
    async event => {
      event.preventDefault()
      closeChoices()
      try {
        if (processingValue) {
          const stop = beginProcessing(PROCESSING.LOAD, processingValue)
          try {
            await hierarchyFn()
          } finally {
            stop()
          }
          return
        }
        await hierarchyFn()
      } catch (error) {
        setAsyncError(error)
      }
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

        <Stack spacing={5} sx={{ mt: 3 }}>
          <Stack spacing={2.5}>
            <HierarchyChoiceButton
              disabled={disableChangeName}
              disabledReason={disableChangeNameReason}
              onClick={handleClick(changeName)}
              text={CONCEPT.HIERARCHY.CHANGE_NAME}
            />
            <HierarchyChoiceButton
              disabled={disableChangeParent}
              disabledReason={disableChangeParentReason}
              onClick={handleClick(changeParent, PROCESSING.ARG.CONCEPT_DESCENDANTS)}
              text={CONCEPT.HIERARCHY.CHANGE_PARENT}
            />
            <HierarchyChoiceButton
              disabled={disableAddChild}
              disabledReason={disableAddChildReason}
              onClick={handleClick(addChild)}
              text={CONCEPT.HIERARCHY.ADD_CHILD}
            />
          </Stack>
          <HierarchyChoiceButton
            color='cancel'
            disabled={disableDelete}
            disabledReason={disableDeleteReason}
            onClick={handleClick(deleteConcept, PROCESSING.ARG.CONCEPT_DEPENDENCIES)}
            text={CONCEPT.HIERARCHY.DELETE_CONCEPT}
          />
        </Stack>
      </Box>
    </Modal>
  )
}

export default ConceptHierarchyChoices
