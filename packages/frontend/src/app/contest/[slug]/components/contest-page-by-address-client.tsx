/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { renderer } from "@/components/common/count-down-renderer";
import { Icons } from "@/components/common/icons";
import Loader from "@/components/common/loader";
import PageWrapper from "@/components/common/page-wrapper";
import UserAddress from "@/components/common/user-address";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { contestContractAbi } from "@/lib/constants";
import { ContestStatus } from "@/lib/utils";
import numeral from "numeral";
import Countdown from "react-countdown";
import { useReadContracts } from "wagmi";
import SubmitEntry from "./submit-entry";

type Props = {
  slug: `0x${string}`;
};

const tabList = ["contest", "guidelines", "rewards"];

const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
};

const ContestPageByAddressClient = ({ slug }: Props) => {
  console.log("slug", slug);
  const { data, isPending } = useReadContracts({
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

  console.log("entryStartTime", entryStartTime);

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

  console.log("data", data);
  console.log("isPending", isPending);

  if (isPending) return <Loader />;
  return (
    <main className="pb-[100px] pt-6 text-white">
      <PageWrapper className="">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="mb-5 mt-3 text-2xl font-bold leading-[38px]">
            {/* @ts-expect-error unknown */}
            {data?.[0]?.result?.title}
          </h1>
          <SubmitEntry address={slug} />
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
          <TabsContent value="rewards">
            <div className="border-gradient mx-auto mt-[41px] flex max-w-[360px] flex-col items-center gap-y-2 py-6">
              <Icons.infoEmpty />
              <p className="text-xl font-normal leading-8">
                This feature is Coming soon
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </main>
  );
};

export default ContestPageByAddressClient;
