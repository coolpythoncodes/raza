/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Icons } from "@/components/common/icons";
import Loader from "@/components/common/loader";
import UserAddress from "@/components/common/user-address";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { contestContractAbi } from "@/lib/constants";
import { routes } from "@/lib/routes";
import { ContestStatus } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import numeral from "numeral";
import pluralize from "pluralize";
import { useEffect } from "react";
import {
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

type Props = {
  entry: bigint;
  address: `0x${string}`;
  status: number;
};
const Entry = ({ entry, address, status }: Props) => {
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

  return (
    <Link href={`${routes.contest}/${address}/${entry}`}>
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
              disabled={status !== ContestStatus.VotingStarted}
              onClick={() => {
                writeContract({
                  address,
                  abi: contestContractAbi,
                  functionName: "vote",
                  args: [entry],
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
                  {pluralize(
                    "Vote",
                    // @ts-expect-error unknown error
                    Number(data?.[0]?.result?.numberOfVotes),
                  )}{" "}
                  ({/* @ts-expect-error unknown error */}
                  {numeral(Number(data?.[0]?.result?.numberOfVotes)).format(
                    "0,0",
                  )}
                  )
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </Link>
  );
};

export default Entry;
