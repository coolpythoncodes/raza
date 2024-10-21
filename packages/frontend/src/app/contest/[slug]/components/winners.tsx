/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { contestContractAbi } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import {
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import WinningEntry from "./winning-entry";

type Props = {
  address: `0x${string}`;
};

const Winners = ({ address }: Props) => {
  const { data, isPending } = useReadContracts({
    contracts: [
      {
        address,
        abi: contestContractAbi,
        functionName: "getWinners",
      },
      {
        address,
        abi: contestContractAbi,
        functionName: "s_winnersComputed",
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
    // isSuccess: isConfirmed,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWriteError, isConfirmError]);

  console.log("data", data);

  if (isPending) return <Loader />;
  return (
    <div>
      {data?.[0]?.error ? (
        <>
          <Button
            className="disabled:cursor-not-allowed"
            disabled={!data?.[1]?.result || isPendingWrite || isConfirming}
            onClick={() => {
              writeContract({
                address,
                abi: contestContractAbi,
                functionName: "computeWinners",
              });
            }}
          >
            {isPendingWrite ||
              (isConfirming && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ))}
            {isConfirming ? "Confirming transaction" : "Compute Winners"}
          </Button>
        </>
      ) : (
        <>
          {/* winning entries data */}
          {/* @ts-expect-error unknown error */}
          {data?.[0]?.result?.length ? (
            <section className="mt-[14px] space-y-[25px]">
              <h1 className="text-xl font-normal leading-7">Winning entries</h1>

              <div className="flex flex-col gap-y-6">
                {/*  @ts-expect-error unknown error  */}
                {data?.[0]?.result?.map((entry, index) => (
                  <WinningEntry
                    key={`winning-entries-${index}`}
                    address={address}
                    entry={entry}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
};

export default Winners;
