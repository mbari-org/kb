import TemplatesProvider from '@/contexts/templates/TemplatesProvider'
import TemplatesContent from '@/components/kb/panels/templates/TemplatesContent'

const Templates = () => {
  return (
    <TemplatesProvider>
      <TemplatesContent />
    </TemplatesProvider>
  )
}

export default Templates
