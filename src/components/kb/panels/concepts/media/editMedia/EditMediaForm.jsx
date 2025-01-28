import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField,
} from "@mui/material"

const EditMediaForm = forwardRef(({ mediaItem, onSubmit }, ref) => {
  const [editingMediaState, setEditingMediaState] = useState({
    caption: mediaItem.caption || "",
    credit: mediaItem.credit || "",
    url: mediaItem.url || "",
    isPrimary: mediaItem.isPrimary || false,
  })

  const formRef = useRef(null)

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
          label="Caption"
          name="caption"
          value={editingMediaState.caption}
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
          label="URL"
          name="url"
          value={editingMediaState.url}
          onChange={handleChange}
          required
        />
      </FormControl>
      <FormControlLabel
        control={
          <Checkbox
            name="isPrimary"
            checked={editingMediaState.isPrimary}
            onChange={handleChange}
          />
        }
        label="Is Primary"
      />
    </Box>
  )
})

EditMediaForm.displayName = "EditMediaForm"

export default EditMediaForm
