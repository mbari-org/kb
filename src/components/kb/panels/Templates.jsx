import TemplatesPanel from '@/components/kb/panels/templates/TemplatesPanel'
import TemplatesProvider from '@/contexts/panels/templates/TemplatesProvider'

const Templates = () => {
  return (
    <TemplatesProvider>
      <TemplatesPanel />
    </TemplatesProvider>
  )
}

export default Templates
