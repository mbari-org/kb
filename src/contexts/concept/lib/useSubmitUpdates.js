// import { use, useCallback } from "react"

// import update from "./submit/update"
// import validateUpdates from "./submit/validateUpdates"

// import AuthContext from "@/contexts/auth/AuthContext"

// import useProcessError from "@/lib/hooks/useProcessError"

// import { stateChange } from "@/lib/kb/util"

// export const UPDATE_ALL_DATA = "all"
// export const UPDATE_NAME_ONLY = "solo"

// const allValid = values => Object.values(values).every(Boolean)

// const useSubmitUpdates = ({
//   concept,
//   config,
//   editingState,
//   initialState,
//   modified,
//   modifyConcept,
//   ranks,
//   resetState,
//   selectConcept,
//   setModal,
//   showBoundary,
//   updateConcept,
//   updateConceptName,
// }) => {
//   const { user } = use(AuthContext)

//   const processError = useProcessError()

//   const onAction = useCallback(
//     () => resetState(initialState),
//     [initialState, resetState]
//   )

//   const submitDetailUpdates = useCallback(
//     updates => {
//       validateUpdates({
//         concept,
//         initialState,
//         modifyConcept,
//         ranks,
//         setModal,
//         updates,
//         user,
//       }).then(validation => {
//         if (allValid(validation)) {
//           update({
//             concept,
//             config,
//             updates,
//             // validation: detailValidation,
//           }).then(
//             ({ error, updatedConcept }) => {
//               if (error) {
//                 processError(error)
//                 return
//               }
//               updateConcept(updatedConcept).then(
//                 () => resetState(editingState),
//                 error => showBoundary(error)
//               )
//             },
//             error => showBoundary(error)
//           )
//         }
//       })
//     },
//     [
//       concept,
//       initialState,
//       modifyConcept,
//       ranks,
//       setModal,
//       user,
//       config,
//       updateConcept,
//       processError,
//       resetState,
//       editingState,
//       showBoundary,
//     ]
//   )

//   const submitNameUpdate = useCallback(
//     updates => {
//       nameUpdates({ concept, config, updates }).then(
//         ({ error, updatedName }) => {
//           if (error) {
//             processError(error, onAction)
//             return
//           }
//           updateConceptName(concept, updatedName).then(
//             () => {
//               selectConcept(updatedName)
//               resetState(editingState)
//             },
//             error => showBoundary(error)
//           )
//         },
//         error => showBoundary(error)
//       )
//     },
//     [
//       concept,
//       config,
//       onAction,
//       processError,
//       resetState,
//       selectConcept,
//       showBoundary,
//       updateConceptName,
//       editingState,
//     ]
//   )

//   const submitUpdates = choice => {
//     if (!modified) {
//       resetState(initialState)
//       return
//     }

//     const pendingEdits = stateChange(initialState, editingState)
//     const updates = Object.keys(pendingEdits).reduce((acc, key) => {
//       acc[key] = pendingEdits[key].pending
//       return acc
//     }, {})

//     switch (choice) {
//       case "All Data":
//         submitNameUpdate(UPDATE_ALL_DATA, updates)
//         break
//       case "Cancel":
//         resetState(initialState)
//         break
//       case "Detail":
//         submitDetailUpdates(updates)
//         break
//       case "Name Only":
//         submitNameUpdate(UPDATE_NAME_ONLY, updates)
//         break
//       default:
//         break
//     }
//   }

//   return submitUpdates
// }

// export default useSubmitUpdates
