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
import { CONCEPT } from "@/contexts/concept/lib/conceptStateReducer"

const EditMediaForm = forwardRef(({ mediaIndex }, ref) => {
  const { editingState, modifyConcept } = use(ConceptContext)
  const { data, setModal, setData } = use(ModalContext)

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
      touched: {
        ...prev.touched,
        [name]: true,
      },
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()

    const type =
      mediaIndex === editingState.media.length
        ? CONCEPT.MEDIA_ADD
        : CONCEPT.MEDIA_EDIT
    modifyConcept({
      type,
      update: {
        mediaIndex,
        mediaItem: data.editing,
      },
    })
    setModal(null)
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
      touched: {},
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
          error={data.touched?.url && data.editing.url.trim() === ""}
          helperText={
            data.touched?.url && data.editing.url.trim() === ""
              ? "URL cannot be empty"
              : ""
          }
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Credit"
          name="credit"
          onChange={handleChange}
          required
          value={data.editing.credit}
          error={data.touched?.credit && data.editing.credit.trim() === ""}
          helperText={
            data.touched?.credit && data.editing.credit.trim() === ""
              ? "Credit cannot be empty"
              : ""
          }
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
