import ModalShell from '@/components/modal/ModalShell'

const PanelModal = ({
  actions,
  content,
  titleComponent,
  closeModal,
  minWidth,
  processing = false,
  processingMessage,
}) => (
  <ModalShell
    title={titleComponent}
    content={content}
    actions={actions}
    closeModal={closeModal}
    minWidth={minWidth}
    processing={Boolean(processing)}
    processingMessage={processingMessage}
  />
)

export default PanelModal
