import { ContestStatus } from "@/lib/utils";
import Countdown from "react-countdown";
import { renderer } from "./count-down-renderer";

type Props = {
  entryStartTime: bigint;
  entryEndTime: bigint;
  votingStartTime: bigint;
  votingEndTime: bigint;
  status: number;
  isCanceled?: boolean;
};

const ContestDuration = ({
  entryStartTime,
  entryEndTime,
  votingStartTime,
  votingEndTime,
  status,
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

  const getContestDurationMessage = () => {
    const currentStatus = getContestStatus();

    switch (currentStatus) {
      case ContestStatus.Waiting:
        return (
          <>
            <p>Kindly wait</p>
          </>
        );
      case ContestStatus.Inactive:
        return (
          <>
            <p>Contest opens in:</p>
            <Countdown date={entryStart} renderer={renderer} />
          </>
        );

      case ContestStatus.OpenForParticipants:
        return (
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-1">
              <p>Entry period ends in:</p>
              <Countdown date={entryEnd} renderer={renderer} />
            </div>
            {now < votingStart && (
              <div className="flex items-center gap-x-1">
                <p>Voting begins in:</p>
                <Countdown date={votingStart} renderer={renderer} />
              </div>
            )}
          </div>
        );

      case ContestStatus.VotingStarted:
        return (
          <>
            <p>Voting ends in:</p>
            <Countdown date={votingEnd} renderer={renderer} />
          </>
        );

      case ContestStatus.Canceled:
        return <p>Contest has been canceled</p>;

      case ContestStatus.Ended:
        return <p>Contest has ended</p>;

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-x-1 text-xs text-[#D7C5FF]">
      {getContestDurationMessage()}
    </div>
  );
};

export default ContestDuration;
