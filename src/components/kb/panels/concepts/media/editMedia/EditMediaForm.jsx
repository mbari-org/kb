import { forwardRef, use, useEffect, useState } from "react"
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Icon,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material"
import { MdOutlinePhoto } from "react-icons/md"

import ConceptContext from "@/contexts/concept/ConceptContext"
import ModalContext from "@/contexts/modal/ModalContext"

import { hasPrimary, isPrimary } from "@/lib/kb/concept/media"
import { CONCEPT } from "@/contexts/concept/lib/conceptStateReducer"
import MediaDisplay from "../MediaDisplay"

const EditMediaForm = forwardRef(({ mediaIndex }, ref) => {
  const { editingState, modifyConcept } = use(ConceptContext)
  const { data, setModal, setData } = use(ModalContext)

  const [showPrimaryCheckbox, setShowPrimaryCheckbox] = useState(false)
  const [previewImage, setPreviewImage] = useState(false)

  const isValidUrl = url => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const checkUrlExists = url => {
    return new Promise(resolve => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
    })
  }

  const [urlStatus, setUrlStatus] = useState({ loading: false, valid: true })
  const [urlCheckTimeout, setUrlCheckTimeout] = useState(null)

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

    // Debounced URL check
    if (name === "url" && isValidUrl(value)) {
      // Clear any existing timeout
      if (urlCheckTimeout) {
        clearTimeout(urlCheckTimeout)
      }

      // Set loading state immediately
      setUrlStatus({ loading: true, valid: true })

      // Create new timeout for URL check
      const timeoutId = setTimeout(() => {
        checkUrlExists(value).then(exists => {
          setUrlStatus({ loading: false, valid: exists })
        })
      }, 500) // 1 second delay

      setUrlCheckTimeout(timeoutId)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // First check if URL is valid
    if (!isValidUrl(data.editing.url)) {
      return
    }

    // Show loading state
    setUrlStatus({ loading: true, valid: true })

    // Check if URL is accessible
    const urlExists = await checkUrlExists(data.editing.url)
    setUrlStatus({ loading: false, valid: urlExists })

    if (!urlExists) {
      return
    }

    // Proceed with form submission
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

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (urlCheckTimeout) {
        clearTimeout(urlCheckTimeout)
      }
    }
  }, [urlCheckTimeout])

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
          error={
            data.touched?.url &&
            (data.editing.url.trim() === "" ||
              !isValidUrl(data.editing.url) ||
              (!urlStatus.loading && !urlStatus.valid))
          }
          helperText={
            data.touched?.url
              ? data.editing.url.trim() === ""
                ? "URL cannot be empty"
                : !isValidUrl(data.editing.url)
                ? "Please enter a valid URL"
                : urlStatus.loading
                ? "Checking URL..."
                : !urlStatus.valid
                ? "URL is not accessible"
                : ""
              : ""
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {!urlStatus.loading &&
                  urlStatus.valid &&
                  isValidUrl(data.editing.url) &&
                  data.editing.url.trim() !== "" && (
                    <IconButton
                      onClick={() => setPreviewImage(true)}
                      edge="end"
                    >
                      <Icon
                        color="main"
                        component={MdOutlinePhoto}
                        sx={{ mb: 2, fontSize: 20 }}
                      />
                    </IconButton>
                  )}
              </InputAdornment>
            ),
          }}
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
      <MediaDisplay
        mediaIndex={mediaIndex}
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
        url={data.editing.url}
      />
    </Box>
  )
})

EditMediaForm.displayName = "EditMediaForm"

export default EditMediaForm
