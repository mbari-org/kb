import FieldValueDetail from "./FieldValueDetail"

import { formatDelta } from "@/components/common/format"

const FieldDeltaDetail = ({ edit }) => {
  const [field, { initial, pending }] = edit

  return (
    <FieldValueDetail field={field} value={formatDelta(initial, pending)} />
  )
}

export default FieldDeltaDetail
