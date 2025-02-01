import { forwardRef, use, useEffect, useImperativeHandle, useRef } from "react"
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField,
} from "@mui/material"

import ConceptContext from "@/contexts/concept/ConceptContext"
import ModalContext from "@/contexts/modal/ModalContext"

import { hasPrimary } from "@/lib/kb/concept/media"

const EditMediaForm = forwardRef(({ mediaIndex, onSubmit }, ref) => {
  const formRef = useRef(null)

  const { editingState } = use(ConceptContext)
  const { data, setData } = use(ModalContext)

  const showPrimaryCheckbox = !hasPrimary || editingState.isPrimary

  const handleChange = e => {
    const { name, value, type, checked } = e.target

    const newEditing = {
      ...data.editing,
      [name]: type === "checkbox" ? checked : value,
    }

    const isDirty = Object.keys(newEditing).some(
      key => newEditing[key] !== data.initial[key]
    )

    setData(prev => ({
      ...prev,
      dirty: isDirty,
      editing: newEditing,
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit(data.editing)
  }

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      if (formRef.current) {
        formRef.current.requestSubmit()
      }
    },
  }))

  useEffect(() => {
    const mediaItem = editingState.media[mediaIndex] || {
      url: "",
      credit: "",
      caption: "",
      isPrimary: false,
    }
    setData({ initial: mediaItem, dirty: false, editing: mediaItem })
  }, [editingState.media, mediaIndex, setData])

  if (!data) {
    return null
  }

  return (
    <Box component="form" onSubmit={handleSubmit} ref={formRef}>
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
