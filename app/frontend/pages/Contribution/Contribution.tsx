import { ContributionType } from "./types"

interface ContributionProps {
  contribution: ContributionType
}

export default function Contribution({ contribution }: ContributionProps) {
  return (
    <div>
      <p className="my-5">
        <strong className="block font-medium mb-1">User:</strong>
        {contribution.user_id?.toString()}
      </p>
      <p className="my-5">
        <strong className="block font-medium mb-1">Status:</strong>
        {contribution.status?.toString()}
      </p>
      <p className="my-5">
        <strong className="block font-medium mb-1">Contributable:</strong>
        {contribution.contributable_id?.toString()}
      </p>
    </div>
  )
}
