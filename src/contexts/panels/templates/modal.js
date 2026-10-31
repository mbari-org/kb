import createPanelModalProvider from '@/contexts/common/createPanelModalProvider'
import usePanelModal from '@/contexts/panel/modal/usePanelModal'

const {
  DataContext: TemplatesModalDataContext,
  OperationsContext: TemplatesModalOperationsContext,
  Provider: TemplatesModalProvider,
  useDataContext: useTemplatesModalDataContext,
  useOperationsContext: useTemplatesModalOperationsContext,
} = createPanelModalProvider('Templates', usePanelModal)

export {
  TemplatesModalDataContext,
  TemplatesModalOperationsContext,
  TemplatesModalProvider,
  useTemplatesModalDataContext,
  useTemplatesModalOperationsContext,
}
