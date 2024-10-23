/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import ContestDuration from "@/components/common/contest-duration";
import ContestStatusBadge from "@/components/common/contest-status-badge";
import UserAddress from "@/components/common/user-address";
import { contestContractAbi } from "@/lib/constants";
import { routes } from "@/lib/routes";
import { UserCircle } from "lucide-react";
import Link from "next/link";
import { useReadContracts } from "wagmi";

type Props = {
  address: `0x${string}`;
};

const ContestItem = ({ address }: Props) => {
  // const { data, isPending, error, isError } = useReadContract({
  //   address,
  //   abi: contestContractAbi,
  //   functionName: "getContestDetails",
  // });
  const { data } = useReadContracts({
    contracts: [
      {
        address,
        abi: contestContractAbi,
        functionName: "getContestDetails",
      },
      {
        address,
        abi: contestContractAbi,
        functionName: "getContestStatus",
      },
    ],
  });

  console.log("data", data);
  console.log("status", data?.[1]?.result);

  return (
    <div className="border-gradient transform space-y-5 p-7 font-normal text-white transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
      <div className="space-y-3">
        <h4 className="line-clamp-1 text-[28px] capitalize leading-10">
          {/* @ts-expect-error unknown error  */}
          {data?.[0]?.result?.title}
        </h4>
        <div className="flex items-center gap-x-2">
          {/* <div className="h-7 w-7 rounded-full bg-[#D9D9D9]" /> */}
          <UserCircle />
          {/* @ts-expect-error unknown error  */}
          <UserAddress address={data?.[0]?.result?.organizer} />
        </div>
      </div>

      <div className="space-y-3">
        <ContestStatusBadge
          //  @ts-expect-error unknown error
          status={data?.[1]?.result}
          // @ts-expect-error unknown error
          entryEndTime={data?.[0]?.result?.entryEndTime}
        />

        <ContestDuration
          // @ts-expect-error unknown error
          entryStartTime={data?.[0]?.result?.entryStartTime}
          // @ts-expect-error unknown error
          entryEndTime={data?.[0]?.result?.entryEndTime}
          // @ts-expect-error unknown error
          votingStartTime={data?.[0]?.result?.votingStartTime}
          // @ts-expect-error unknown error
          votingEndTime={data?.[0]?.result?.votingEndTime}
          // @ts-expect-error unknown error
          status={data?.[1]?.result}
        />
      </div>

      <Link
        href={`${routes.contest}/${address}`}
        className="border-gradient flex h-[60px] w-full items-center justify-center text-base font-normal hover:bg-custom-gradient"
      >
        View Contest
      </Link>
    </div>
  );
};

export default ContestItem;
