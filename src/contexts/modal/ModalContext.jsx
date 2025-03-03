import { createContext } from 'react'

export const MODAL_X = 'X'

const ModalContext = createContext()
ModalContext.displayName = 'Modal Context'

export default ModalContext
