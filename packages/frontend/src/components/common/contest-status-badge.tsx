import { cn, ContestStatus, statusConfig } from "@/lib/utils";
import React from "react";

type Props = {
  status: number;
  entryStartTime: bigint;
  entryEndTime: bigint;
  votingStartTime: bigint;
  votingEndTime: bigint;
};

const ContestStatusBadge = ({
  status,
  entryStartTime,
  entryEndTime,
  votingStartTime,
  votingEndTime,
}: Props) => {
  const entryStart = Number(entryStartTime) * 1000;
  const entryEnd = Number(entryEndTime) * 1000;
  const votingStart = Number(votingStartTime) * 1000;
  const votingEnd = Number(votingEndTime) * 1000;

  const now = Date.now();

  const getContestStatus = () => {
    if (status === ContestStatus.Canceled) {
      return ContestStatus.Canceled;
    }
    if (now < entryStart) {
      return ContestStatus.Inactive;
    }
    if (now >= entryStart && now <= entryEnd) {
      return ContestStatus.OpenForParticipants;
    }
    if (now > entryEnd && now >= votingStart && now <= votingEnd) {
      return ContestStatus.VotingStarted;
    }
    if (now > votingEnd) {
      return ContestStatus.Ended;
    }
    return ContestStatus.Waiting;
  };

  const currentStatus = getContestStatus();
  // if (Date().now >=  entryEnd && status === 0) {

  // }
  // @ts-expect-error unknown error
  const { text } =
    statusConfig[currentStatus] ?? statusConfig[ContestStatus.Inactive];
  return (
    <div className="flex items-center gap-x-2">
      <div
        className={cn("h-3 w-3 rounded-full", {
          "bg-yellow-500": currentStatus === ContestStatus.Inactive,
          "bg-green-500":
            currentStatus === ContestStatus.OpenForParticipants ||
            currentStatus === ContestStatus.VotingStarted,
          "bg-red-500":
            currentStatus === ContestStatus.Canceled ||
            currentStatus === ContestStatus.Ended,
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
