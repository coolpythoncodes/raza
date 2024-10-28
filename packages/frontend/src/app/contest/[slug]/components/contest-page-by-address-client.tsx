/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { renderer } from "@/components/common/count-down-renderer";
import { Icons } from "@/components/common/icons";
import Loader from "@/components/common/loader";
import NoContest from "@/components/common/no-contest";
import PageWrapper from "@/components/common/page-wrapper";
import UserAddress from "@/components/common/user-address";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { contestContractAbi } from "@/lib/constants";
import { ContestStatus } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import numeral from "numeral";
import { useEffect } from "react";
import Countdown from "react-countdown";
import { TwitterShareButton } from "react-share";
import { useBlockNumber, useReadContracts } from "wagmi";
import Entry from "./entry";
import SubmitEntry from "./submit-entry";
import Winners from "./winners";

type Props = {
  slug: `0x${string}`;
};

const tabList = ["contest", "guidelines", "winners"];

const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
};

const ContestPageByAddressClient = ({ slug }: Props) => {
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
    ],
  });
  const entryStartTime = new Date(
    // @ts-expect-error unknown error
    Number(data?.[0]?.result?.entryStartTime) * 1000,
  );
  const entryEndTime = new Date(
    // @ts-expect-error unknown error
    Number(data?.[0]?.result?.entryEndTime) * 1000,
  );
  const votingStartTime = new Date(
    // @ts-expect-error unknown error
    Number(data?.[0]?.result?.votingStartTime) * 1000,
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

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    queryClient.invalidateQueries({ queryKey });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);

  if (isPending) return <Loader />;

  if (data?.[0]?.error) return <NoContest />;

  return (
    <main className="pb-[100px] pt-6 text-white">
      <PageWrapper className="">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="mb-5 mt-3 text-2xl font-bold leading-[38px]">
            {/* @ts-expect-error unknown */}
            {data?.[0]?.result?.title}
          </h1>
          {status == ContestStatus.OpenForParticipants ? (
            <SubmitEntry address={slug} />
          ) : null}
        </div>
        <div className="mt-6 flex items-center gap-x-3">
          <Icons.logoWithCircle className="h-5 w-5" />
          <div className="flex items-center gap-x-1 text-xs font-normal leading-[28px]">
            <p>Contest by</p>{" "}
            <UserAddress
              // @ts-expect-error unknown error
              address={data?.[0]?.result?.organizer}
              className="text-xs font-bold"
            />
          </div>
        </div>
        <TwitterShareButton
          // @ts-expect-error unknown error
          title={`🚀 Exciting Contest Alert! 🚀 \n\n ${data?.[0]?.result?.title} \n\n 🎉 Join now and stand a chance to win big!🎉 \n\n  Don't forget to follow @devrapture and @borderlessdev for more awesome updates! 🛠️✨ \n\n`}
          url={window.location.href}
          related={["@devrapture", "@borderlessdev"]}
        >
          Share contest on Twitter to get participants
        </TwitterShareButton>
        <Tabs defaultValue={tabList[0]}>
          <TabsList className="w-full">
            {tabList?.map((tab, index) => (
              <TabsTrigger
                key={`tab-list-${index}`}
                value={tab}
                className="text-sm font-normal capitalize leading-[18px] data-[state=active]:text-white"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          {/* Contest tab */}
          <TabsContent value="contest">
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
            {/* entries data */}
            {/* @ts-expect-error unknown error */}
            {data?.[2]?.result?.length ? (
              <section className="mt-[14px] space-y-[25px]">
                <h1 className="text-xl font-normal leading-7">All entries</h1>

                <div className="flex flex-col gap-y-6">
                  {/*  @ts-expect-error unknown error  */}
                  {data?.[2]?.result?.map((entry, index) => (
                    // @ts-expect-error unknown error
                    <Entry
                      key={`entries-${index}`}
                      address={slug}
                      {...{ status, entry }}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </TabsContent>

          {/* Guidance tab */}
          <TabsContent value="guidelines" className="space-y-5">
            <div className="space-y-2">
              <h1 className="text-lg font-normal leading-[26px]">
                Sequence of Events
              </h1>
              <div className="grid grid-cols-1 gap-y-4 md:grid-cols-3">
                <div className="space-y-2 text-sm font-normal leading-[22px] text-[#FFFFFF99]">
                  <p>Entry Starts</p>
                  <p>{entryStartTime?.toLocaleString("en-US", options)}</p>
                </div>
                <div className="space-y-2 text-sm font-normal leading-[22px] text-[#FFFFFF99]">
                  <p>Voting Starts</p>
                  <p>{votingStartTime?.toLocaleString("en-US", options)}</p>
                </div>
                <div className="space-y-2 text-sm font-normal leading-[22px] text-[#FFFFFF99]">
                  <p>Voting Ends</p>
                  <p>{votingEndTime?.toLocaleString("en-US", options)}</p>
                </div>
              </div>
            </div>
            {/* Participation */}
            <div className="space-y-2">
              <h2 className="text-lg font-normal leading-[26px]">
                Participation
              </h2>
              <div className="border-gradient max-w-[360px] rounded-2xl bg-[#FFFFFF0D] p-5 text-white">
                <ul className="space-y-2">
                  <li className="flex items-center gap-x-2">
                    <Icons.diamondOutline />
                    <p className="flex-1 text-sm font-normal leading-[22px]">
                      Qualified wallets can submit up to{" "}
                      <span>
                        {numeral(
                          // @ts-expect-error unknown error
                          Number(data?.[0]?.result?.maxEntriesPerParticipant),
                        ).format("0,0")}
                      </span>{" "}
                      entry
                    </p>
                  </li>
                  <li className="flex items-center gap-x-2">
                    <Icons.diamondOutline />
                    <p className="flex-1 text-sm font-normal leading-[22px]">
                      The contest accepts a maximum of{" "}
                      <span>
                        {numeral(
                          // @ts-expect-error unknown error
                          Number(data?.[0]?.result?.maxTotalEntries),
                        ).format("0,0")}
                      </span>{" "}
                      entries
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Voting */}
            <div className="space-y-2">
              <h2 className="text-lg font-normal leading-[26px]">Voting</h2>
              <div className="border-gradient max-w-[360px] rounded-2xl bg-[#FFFFFF0D] p-5 text-white">
                <ul>
                  <li className="flex items-center gap-x-2">
                    <Icons.diamondOutline />
                    <p className="flex-1 text-sm font-normal leading-[22px]">
                      Voting is open to everyone
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          {/* Rewards tab */}
          <TabsContent value="winners">
            <Winners address={slug} />
            {/* <div className="border-gradient mx-auto mt-[41px] flex max-w-[360px] flex-col items-center gap-y-2 py-6">
              <Icons.infoEmpty />
              <p className="text-xl font-normal leading-8">
                This feature is Coming soon
              </p>
            </div> */}
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </main>
  );
};

export default ContestPageByAddressClient;
