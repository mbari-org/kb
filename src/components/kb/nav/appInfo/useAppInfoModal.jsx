import { use, useCallback } from 'react'

import createAppModal from '@/components/modal/app/createAppModal'
import AppInfoContent from '@/components/kb/nav/appInfo/AppInfoContent'
import AppInfoTitle from '@/components/kb/nav/appInfo/AppInfoTitle'
import AppModalContext from '@/contexts/app/AppModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const useAppInfoModal = () => {
  const { setModal } = use(AppModalContext)
  const { getConceptPrimaryName, getNames } = use(TaxonomyContext)

  const openAppInfoModal = useCallback(() => {
    const conceptNames = getNames() || []
    const modal = createAppModal({
      Content: () => (
        <AppInfoContent
          conceptNames={conceptNames}
          getConceptPrimaryName={getConceptPrimaryName}
          onEditComplete={openAppInfoModal}
        />
      ),
      Title: AppInfoTitle,
      width: '50%',
      focusClose: true,
      contentSx: { '&:last-child': { pb: 0 } },
    })
    setModal(modal)
  }, [getConceptPrimaryName, getNames, setModal])

  return { openAppInfoModal }
}

export default useAppInfoModal
