import createPanelModalProvider from '@/contexts/common/createPanelModalProvider'
import useTemplatesModal from './useTemplatesModal'

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

