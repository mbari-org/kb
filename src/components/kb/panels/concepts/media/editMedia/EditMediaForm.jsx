import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField,
} from "@mui/material"

import { isPrimary as isPrimaryMedia } from "@/lib/kb/concept/media"

const EditMediaForm = forwardRef(({ hasPrimary, mediaItem, onSubmit }, ref) => {
  const formRef = useRef(null)

  const [editingMediaState, setEditingMediaState] = useState({
    url: mediaItem.url || "",
    credit: mediaItem.credit || "",
    caption: mediaItem.caption || "",
    isPrimary: isPrimaryMedia(mediaItem),
  })

  const showPrimaryCheckbox = !hasPrimary || editingMediaState.isPrimary

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setEditingMediaState({
      ...editingMediaState,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit(editingMediaState)
  }

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      if (formRef.current) {
        formRef.current.requestSubmit()
      }
    },
  }))

  return (
    <Box component="form" onSubmit={handleSubmit} ref={formRef}>
      <FormControl fullWidth margin="normal">
        <TextField
          label="URL"
          name="url"
          value={editingMediaState.url}
          onChange={handleChange}
          required
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Credit"
          name="credit"
          value={editingMediaState.credit}
          onChange={handleChange}
          required
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Caption"
          name="caption"
          value={editingMediaState.caption}
          onChange={handleChange}
        />
      </FormControl>
      {showPrimaryCheckbox && (
        <Box display="flex" justifyContent="flex-end">
          <FormControlLabel
            control={
              <Checkbox
                checked={editingMediaState.isPrimary}
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
