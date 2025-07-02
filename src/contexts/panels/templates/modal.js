import createPanelModalProvider from '../../common/createPanelModalProvider.jsx'
import useTemplatesModal from './useTemplatesModal'

// Create the complete modal provider setup for templates
const {
  DataContext: TemplatesModalDataContext,
  OperationsContext: TemplatesModalOperationsContext,
  Provider: TemplatesModalProvider,
  useDataContext: useTemplatesModalDataContext,
  useOperationsContext: useTemplatesModalOperationsContext,
} = createPanelModalProvider('Templates', useTemplatesModal)

export {
  TemplatesModalDataContext,
  TemplatesModalOperationsContext,
  TemplatesModalProvider,
  useTemplatesModalDataContext,
  useTemplatesModalOperationsContext,
}
