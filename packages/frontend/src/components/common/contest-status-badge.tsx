import { cn, ContestStatus, statusConfig } from "@/lib/utils";
import React from "react";

type Props = {
  status: number;
  entryEndTime: bigint;
};

const ContestStatusBadge = ({ status, entryEndTime }: Props) => {
  const entryEnd = Number(entryEndTime) * 1000;
  console.log("entryEnd", entryEnd);

  // if (Date().now >=  entryEnd && status === 0) {

  // }
  // @ts-expect-error unknown error
  const { text } = statusConfig[status] ?? statusConfig[ContestStatus.Inactive];
  console.log();
  return (
    <div className="flex items-center gap-x-2">
      <div
        className={cn("h-3 w-3 rounded-full", {
          "bg-yellow-500": status === ContestStatus.Inactive,
          "bg-green-500":
            status === ContestStatus.OpenForParticipants ||
            status === ContestStatus.VotingStarted,
          "bg-red-500":
            status === ContestStatus.Canceled || status === ContestStatus.Ended,
        })}
      />
      <span className="text-xs font-normal leading-[19px]">{text}</span>
      {/* <span className="text-xs font-normal leading-[19px]">
        {new Date().now >= entryEnd && status === 0
          ? "voting starts soon"
          : `${text}`}
      </span> */}
    </div>
  );
};

export default ContestStatusBadge;
