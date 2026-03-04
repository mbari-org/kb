import { useCallback, useRef, useState, use } from 'react'

import Stack from '@mui/material/Stack'

import ConceptSelect from '@/components/common/concept/ConceptSelect'
import ConceptsTree from '@/components/kb/panels/concepts/sidebar/tree/ConceptsTree'
import SidebarSelectAuxiliary from '@/components/kb/panels/concepts/sidebar/select/SidebarSelectAuxiliary'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

const ConceptsSidebar = () => {
  const { concept } = use(ConceptContext)
  const { concepts } = use(SelectedContext)

  const [autoExpand, setAutoExpand] = useState(null)

  const scrollToConceptRef = useRef(() => { })

  const registerScrollFn = useCallback(scrollHandler => {
    scrollToConceptRef.current = scrollHandler || (() => {})
  }, [])

  const handleScroll = useCallback(() => {
    scrollToConceptRef.current?.()
  }, [])

  if (!concept) return null

  const doConceptSelected = selectedName => {
    setAutoExpand?.({ expand: true, name: selectedName })
    return true
  }

  return (
    <Stack sx={{ height: '100%', ml: 2, mr: 1, mt: 1.75 }}>
      <ConceptSelect
        auxiliaryComponent={
          <SidebarSelectAuxiliary
            concepts={concepts}
            onScrollToConcept={handleScroll}
          />
        }
        conceptName={concept.name}
        doConceptSelected={doConceptSelected}
        width='auto'
      />
      <ConceptsTree
        autoExpand={autoExpand}
        registerScrollFn={registerScrollFn}
        setAutoExpand={setAutoExpand}
      />
    </Stack>
  )
}

export default ConceptsSidebar
