import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { formatDelta } from '@/components/common/format'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const MediaItemDetail = ({ action, initial, updates }) => {
  let fieldValues

  switch (action) {
    case CONCEPT_STATE.MEDIA.ADD:
      fieldValues = updates
      break
    case CONCEPT_STATE.MEDIA.DELETE:
      fieldValues = initial
      break
    case CONCEPT_STATE.MEDIA.EDIT:
      fieldValues = Object.entries(updates).map(([field, value]) => {
        if (initial[field] !== value) {
          return [field, formatDelta(initial[field], value)]
        }
      })
      // fieldValues = initial.reduce((acc, [field, initialValue], index) => {
      //   const stagedValue = updates[index][1]
      //   if (initialValue !== stagedValue) {
      //     acc.push([field, formatDelta(initialValue, stagedValue)])
      //   }
      //   return acc
      // }, [])
      break
  }
  // if (initial === null) {
  //   // Media Add
  //   fieldValues = updates
  // } else if (updates === null) {
  //   // Media Delete
  //   fieldValues = initial
  // } else {
  //   // Media Edit
  //   fieldValues = initial.reduce((acc, [field, initialValue], index) => {
  //     const stagedValue = updates[index][1]
  //     if (initialValue !== stagedValue) {
  //       acc.push([field, formatDelta(initialValue, stagedValue)])
  //     }
  //     return acc
  //   }, [])
  // }

  return (
    <Box sx={{ ml: 7 }}>
      {fieldValues.map(([field, value]) => (
        <FieldValueDisplay key={field} field={field} value={value} />
      ))}
    </Box>
  )
}

export default MediaItemDetail
