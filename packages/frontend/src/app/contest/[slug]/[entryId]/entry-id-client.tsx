/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { renderer } from "@/components/common/count-down-renderer";
import { Icons } from "@/components/common/icons";
import Loader from "@/components/common/loader";
import PageWrapper from "@/components/common/page-wrapper";
import UserAddress from "@/components/common/user-address";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { contestContractAbi } from "@/lib/constants";
import { ContestStatus } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import numeral from "numeral";
import pluralize from "pluralize";
import { useEffect } from "react";
import Countdown from "react-countdown";
import { TwitterShareButton } from "react-share";
import {
  useBlockNumber,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

type Props = {
  slug: `0x${string}`;
  entryId: string;
};

const EntryIdClient = ({ slug, entryId }: Props) => {
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data, isPending, queryKey } = useReadContracts({
    contracts: [
      {
        address: slug,
        abi: contestContractAbi,
        functionName: "getContestDetails",
      },
      {
        address: slug,
        abi: contestContractAbi,
        functionName: "getContestStatus",
      },
      {
        address: slug,
        abi: contestContractAbi,
        functionName: "getAllEntryIds",
      },
      {
        address: slug,
        abi: contestContractAbi,
        functionName: "getEntry",
        args: [entryId],
      },
    ],
  });

  const {
    data: hash,
    isPending: isPendingWrite,
    isError: isWriteError,
    writeContract,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
    isError: isConfirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isWriteError) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          // @ts-expect-error unknown error
          writeError?.shortMessage || "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
    if (isConfirmError) {
      toast({
        variant: "destructive",
        // @ts-expect-error unknown error
        title: confirmError?.shortMessage || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }

    if (isConfirmed) {
      toast({
        variant: "default",
        description: "Vote was succussful",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWriteError, isConfirmError, isConfirmed]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    queryClient.invalidateQueries({ queryKey });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);

  const entryStartTime = new Date(
    // @ts-expect-error unknown error
    Number(data?.[0]?.result?.entryStartTime) * 1000,
  );
  const entryEndTime = new Date(
    // @ts-expect-error unknown error
    Number(data?.[0]?.result?.entryEndTime) * 1000,
  );

  const votingEndTime = new Date(
    // @ts-expect-error unknown error
    Number(data?.[0]?.result?.votingEndTime) * 1000,
  );
  const status = data?.[1]?.result;

  const getContestDurationMessage = () => {
    switch (status) {
      case ContestStatus.Inactive:
        return (
          <div className="flex items-center gap-x-1 text-base font-normal">
            <p className="text-[#D7C5FF]">Contest is open in:</p>
            <p className="font-bold text-white">
              <Countdown date={entryStartTime} renderer={renderer} />
            </p>
          </div>
        );
      case ContestStatus.OpenForParticipants:
        return (
          <div className="flex items-center gap-x-1 text-base font-normal">
            <p className="text-[#D7C5FF]">Contest participation ends in:</p>
            <p className="font-bold text-white">
              <Countdown date={entryEndTime} renderer={renderer} />
            </p>
          </div>
        );

      case ContestStatus.VotingStarted:
        return (
          <div className="flex items-center gap-x-1 text-base font-normal">
            <p className="text-[#D7C5FF]">Voting ends in:</p>
            <p className="font-bold text-white">
              <Countdown date={votingEndTime} renderer={renderer} />
            </p>
          </div>
        );

      case ContestStatus.Ended:
        return <p className="text-[#D7C5FF]">Contest has ended.</p>;
      default:
        return "";
    }
  };

  if (isPending) return <Loader />;
  return (
    <main className="pb-[100px] pt-6 text-white">
      <PageWrapper>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="mb-5 mt-3 text-2xl font-bold leading-[38px]">
            {/* @ts-expect-error unknown */}
            {data?.[0]?.result?.title}
          </h1>
        </div>
        <div className="mt-6 flex items-center gap-x-3">
          <Icons.logoWithCircle className="h-5 w-5" />
          <div className="flex items-center gap-x-1 text-xs font-normal leading-[28px]">
            <p>Contest by</p>{" "}
            <UserAddress
              // @ts-expect-error unknown error
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              address={data?.[0]?.result?.organizer}
              className="text-xs font-bold"
            />
          </div>
        </div>

        <div className="space-y-3">
          <p
            className="text-base font-normal leading-6"
            dangerouslySetInnerHTML={{
              // @ts-expect-error unknown error
              __html: data?.[0]?.result?.description,
            }}
          />
          {getContestDurationMessage()}

          <div className="flex items-center gap-x-2 text-base font-normal text-[#D7C5FF]">
            <p>
              Total votes: {/* @ts-expect-error unknown error */}
              {numeral(Number(data?.[0]?.result?.totalVotes)).format("0,0")}
            </p>
            <div className="flex items-center gap-x-2">
              <div className="h-[9px] w-[9px] rounded-full bg-[#D9D9D9]" />
              <p>
                Total entries: {/* @ts-expect-error unknown error */}
                {numeral(data?.[2]?.result?.length).format("0,0")}
              </p>
            </div>
          </div>
        </div>

        <div className="border-gradient my-10 rounded-2xl bg-[#FFFFFF0D] p-5">
          <div className="flex items-center gap-x-3">
            <Icons.logoWithCircle className="h-5 w-5" />
            <UserAddress
              // @ts-expect-error unknown error
              address={data?.[3]?.result?.participant}
              className="text-xs font-bold"
            />
          </div>
          <p
            className="mb-4 mt-1 text-sm font-normal leading-[22px]"
            dangerouslySetInnerHTML={{
              // @ts-expect-error unknown error
              __html: data?.[3]?.result?.content,
            }}
          />
          <Button
            className="h-[42px] w-[168px] rounded-[100px] disabled:cursor-not-allowed"
            disabled={status !== ContestStatus.VotingStarted}
            onClick={() => {
              writeContract({
                address: slug,
                abi: contestContractAbi,
                functionName: "vote",
                args: [entryId],
              });
            }}
          >
            {isPendingWrite ||
              (isConfirming && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ))}
            {isConfirming ? (
              "Confirming transaction"
            ) : (
              <>
                {/* @ts-expect-error unknown error */}
                {pluralize("Vote", Number(data?.[3]?.result?.numberOfVotes))} (
                {/* @ts-expect-error unknown error */}
                {numeral(Number(data?.[3]?.result?.numberOfVotes)).format(
                  "0,0",
                )}
                )
              </>
            )}
          </Button>
        </div>

        <TwitterShareButton
          // @ts-expect-error unknown error
          title={`🚨 Hey, friends! I need your support! 🚨\n\n 🗳️ Vote for me in the contest: ${data?.[0]?.result?.title} 🏆\n\n`}
          url={window.location.href}
          related={["@devrapture", "@borderlessdev"]}
        >
          Share contest on Twitter to get more votes
        </TwitterShareButton>
      </PageWrapper>
    </main>
  );
};

export default EntryIdClient;
