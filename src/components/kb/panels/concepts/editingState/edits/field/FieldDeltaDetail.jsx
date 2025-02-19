import FieldValueDetail from './FieldValueDetail'

import { formatDelta } from '@/components/common/format'

const FieldDeltaDetail = ({ edit }) => {
  const [field, { initial, editing }] = edit

  return <FieldValueDetail field={field} value={formatDelta(initial, editing)} />
}

export default FieldDeltaDetail
