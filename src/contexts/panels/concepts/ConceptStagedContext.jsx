import { createContext } from 'react'

// NOTE: there is intentionally no ConceptStagedProvider.jsx. The context value
//  (stagedState, modifyConcept, confirmReset) is derived entirely from state owned
//  by ConceptProvider, so ConceptProvider constructs and provides it inline —
//  the same precedent as RefreshContext, whose value is built in KBContainer.
//  A separate provider would be a pass-through wrapper, and moving the staged
//  state itself out of ConceptProvider would create a circular dependency
//  (useModifyConcept needs initialState; ConceptProvider effects need stagedState).
const ConceptStagedContext = createContext()
ConceptStagedContext.displayName = 'Concept Staged Context'

export default ConceptStagedContext
