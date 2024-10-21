/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Icons } from "@/components/common/icons";
import Loader from "@/components/common/loader";
import UserAddress from "@/components/common/user-address";
import { Button } from "@/components/ui/button";
import { contestContractAbi } from "@/lib/constants";
import numeral from "numeral";
import pluralize from "pluralize";
import { useReadContracts } from "wagmi";

type Props = {
  entry: bigint;
  address: `0x${string}`;
};

const WinningEntry = ({ address, entry }: Props) => {
  const { data, isPending } = useReadContracts({
    contracts: [
      {
        address: address,
        abi: contestContractAbi,
        functionName: "getEntry",
        args: [entry],
      },
    ],
  });
  return (
    <div className="border-gradient rounded-2xl bg-[#FFFFFF0D] p-5">
      {isPending ? (
        <Loader />
      ) : (
        <>
          <div className="flex items-center gap-x-3">
            <Icons.logoWithCircle className="h-5 w-5" />
            <UserAddress
              // @ts-expect-error unknown error
              address={data?.[0]?.result?.participant}
              className="text-xs font-bold"
            />
          </div>
          <p
            className="mb-4 mt-1 text-sm font-normal leading-[22px]"
            dangerouslySetInnerHTML={{
              // @ts-expect-error unknown error
              __html: data?.[0]?.result?.content,
            }}
          />
          <Button
            className="h-[42px] w-[168px] rounded-[100px] disabled:cursor-not-allowed"
            disabled={true}
          >
            Total{" "}
            {pluralize(
              "Vote",
              // @ts-expect-error unknown error
              Number(data?.[0]?.result?.numberOfVotes),
            )}{" "}
            ({/* @ts-expect-error unknown error */}
            {numeral(Number(data?.[0]?.result?.numberOfVotes)).format("0,0")})
          </Button>
        </>
      )}
    </div>
  );
};

export default WinningEntry;
