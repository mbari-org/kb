import FieldValueDetail from './FieldValueDetail'

import { formatDelta } from '@/components/common/format'

const FieldDeltaDetail = ({ edit }) => {
  const [field, { initial, staged }] = edit

  return <FieldValueDetail field={field} value={formatDelta(initial, staged)} />
}

export default FieldDeltaDetail
