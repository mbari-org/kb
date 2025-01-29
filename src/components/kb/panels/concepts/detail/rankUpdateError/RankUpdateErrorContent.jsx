import DescriptionDetail from "../DescriptionDetail"

const RankUpdateErrorContent = ({ detail }) => {
  return (
    <DescriptionDetail
      description="Removing rank name and/or level requires admin role"
      detail={detail}
    />
  )
}

export default RankUpdateErrorContent
