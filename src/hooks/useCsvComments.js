import { use } from 'react'

import UserContext from '@/contexts/user/UserContext'

import { humanTimestamp } from '@/lib/utils'

const useCsvComments = ({ content, count, title }) => {
  const { user } = use(UserContext)

  const csvComments = () => {
    let comments = `# ${title}\n`
    if (content) {
      comments += content.map(line => `#   ${line}`).join('\n')
      comments += '\n'
    }
    comments += `#   Total: ${count}\n`
    comments += `#   Exported By: ${user.name}\n`
    comments += `#   Date: ${humanTimestamp(new Date())}\n`
    comments += '#\n'
    return comments
  }
  return csvComments
}

export default useCsvComments