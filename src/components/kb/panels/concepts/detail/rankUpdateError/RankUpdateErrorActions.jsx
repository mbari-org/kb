import { createActions } from "@/components/modal/factory"

const RESET = "Reset"

const RankUpdateErrorActions = ({ onAction }) => {
  const colors = ["main"]
  const labels = [RESET]

  return createActions({ colors, labels, onAction }, "RankUpdateErrorActions")
}

export default RankUpdateErrorActions
