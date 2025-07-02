import { use } from 'react'

import AppModalContext from '@/contexts/app/AppModalContext'

const KbLoading = () => {
  const { processing } = use(AppModalContext)

  if (!processing) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='rounded-lg bg-white p-6 shadow-lg'>
        <div className='flex items-center space-x-3'>
          <div className='h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent'></div>
          <span className='text-lg font-medium text-gray-900'>Processing...</span>
        </div>
      </div>
    </div>
  )
}

export default KbLoading
