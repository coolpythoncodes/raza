import { ContestStatus } from "@/lib/utils";
import Countdown from "react-countdown";
import { renderer } from "./count-down-renderer";

type Props = {
  entryStartTime: bigint;
  entryEndTime: bigint;
  votingStartTime: bigint;
  votingEndTime: bigint;
  status: number;
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
  console.log("entryStart", entryStart);
  console.log("Date.now()", Date.now());
  const getContestDurationMessage = () => {
    switch (status) {
      case ContestStatus.Inactive:
        return (
          <>
            <p>Contest is open in:</p>
            <Countdown date={entryStart} renderer={renderer} />
          </>
        );
      case ContestStatus.OpenForParticipants:
        return (
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-1">
              <p>Contest participation ends in:</p>
              <Countdown date={entryEnd} renderer={renderer} />
            </div>
            <div className="flex items-center gap-x-1">
              <p>Voting starts in:</p>
              <Countdown date={votingStart} renderer={renderer} />
            </div>
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
        return <p>Contest has been canceled.</p>;
      case ContestStatus.Ended:
        return <p>Contest has ended.</p>;
      default:
        return "";
    }
  };
  return (
    <div className="flex items-center gap-x-1 text-xs text-[#D7C5FF]">
      {getContestDurationMessage()}
    </div>
  );
};

export default ContestDuration;
