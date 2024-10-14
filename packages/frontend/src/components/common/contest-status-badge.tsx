import { cn, ContestStatus, statusConfig } from "@/lib/utils";
import React from "react";

type Props = {
  status: number;
};

const ContestStatusBadge = ({ status }: Props) => {
  // @ts-expect-error unknown error
  const { text } = statusConfig[status] ?? statusConfig[ContestStatus.Inactive];
  return (
    <div className="flex items-center gap-x-2">
      <div
        className={cn("h-3 w-3 rounded-full", {
          "bg-yellow-100": status === ContestStatus.Inactive,
          "bg-green-100": status === ContestStatus.OpenForParticipants,
          "bg-red-100": status === ContestStatus.Canceled,
        })}
      />
      <span className="text-xs font-normal leading-[19px]">{text}</span>
    </div>
  );
};

export default ContestStatusBadge;
