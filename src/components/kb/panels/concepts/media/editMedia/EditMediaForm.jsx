import { forwardRef, use, useEffect, useState } from "react"

import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField,
} from "@mui/material"

import ConceptContext from "@/contexts/concept/ConceptContext"
import ModalContext from "@/contexts/modal/ModalContext"

import { hasPrimary, isPrimary } from "@/lib/kb/concept/media"
import { CONCEPT_STATE } from "@/contexts/concept/lib/conceptStateReducer"

const EditMediaForm = forwardRef(({ mediaIndex }, ref) => {
  const { editingState, modifyConcept } = use(ConceptContext)
  const { data, setAlert, setData } = use(ModalContext)

  const [showPrimaryCheckbox, setShowPrimaryCheckbox] = useState(false)

  const handleChange = e => {
    const { name, value, type, checked } = e.target

    const dataEditing = {
      ...data.editing,
      [name]: type === "checkbox" ? checked : value,
    }

    const isDirty = Object.keys(dataEditing).some(
      key => dataEditing[key] !== data.initial[key]
    )

    setData(prev => ({
      ...prev,
      dirty: isDirty,
      editing: dataEditing,
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    const type =
      mediaIndex === editingState.media.length
        ? CONCEPT_STATE.ADD_MEDIA
        : CONCEPT_STATE.EDIT_MEDIA
    modifyConcept({
      type,
      update: {
        mediaIndex,
        media: data.editing,
      },
    })
    setAlert(null)
  }

  useEffect(() => {
    const mediaItem = editingState.media[mediaIndex] || {
      url: "",
      credit: "",
      caption: "",
      isPrimary: false,
    }

    setData({
      initial: mediaItem,
      dirty: false,
      editing: mediaItem,
    })
    setShowPrimaryCheckbox(
      !hasPrimary(editingState.media) || isPrimary(mediaItem)
    )
  }, [editingState.media, mediaIndex, setData])

  if (!data) {
    return null
  }

  return (
    <Box component="form" onSubmit={handleSubmit} ref={ref}>
      <FormControl fullWidth margin="normal">
        <TextField
          label="URL"
          name="url"
          onChange={handleChange}
          required
          value={data.editing.url}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Credit"
          name="credit"
          onChange={handleChange}
          required
          value={data.editing.credit}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Caption"
          name="caption"
          onChange={handleChange}
          value={data.editing.caption}
        />
      </FormControl>
      {showPrimaryCheckbox && (
        <Box display="flex" justifyContent="flex-end">
          <FormControlLabel
            control={
              <Checkbox
                checked={data.editing.isPrimary}
                name="isPrimary"
                onChange={handleChange}
              />
            }
            label="Is Primary"
          />
        </Box>
      )}
    </Box>
  )
})

EditMediaForm.displayName = "EditMediaForm"

export default EditMediaForm
