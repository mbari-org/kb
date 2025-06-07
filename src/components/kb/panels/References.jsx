import ReferencesContent from '@/components/kb/panels/references/ReferencesContent'
import ReferencesProvider from '@/contexts/references/ReferencesProvider'

const References = () => {
  return (
    <ReferencesProvider>
      <ReferencesContent />
    </ReferencesProvider>
  )
}

export default References
