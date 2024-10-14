/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import FormErrorTextMessage from "@/components/common/form-error-text-message";
import HeadingWithArrow from "@/components/common/heading-with-arrow";
import PageWrapper from "@/components/common/page-wrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import {
  contestFactoryContractAbi,
  contractAddressContestFactory,
} from "@/lib/constants";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { date, number, object, ref, string, type InferType } from "yup";

const createContestFormSchema = object({
  title: string().required("Please provide a title for the contest."),
  description: string().required(
    "Please provide a description for the contest.",
  ),
  entryPeriod: object({
    entryStartTime: date().required(
      "The entry period (start and end dates) is required.",
    ),
    entryEndTime: date()
      .required("The entry period (start and end dates) is required.")
      .min(
        ref("entryStartTime"),
        "Entry end time must be after entry start time",
      ),
  }),
  votingPeriod: object({
    votingStartTime: date().required(
      "The voting period (start and end dates) is required.",
    ),
    // .min(
    //   ref("entryPeriod.entryEndTime"),
    //   "Voting start time must be after entry end time",
    // ),
    votingEndTime: date().required(
      "The voting period (start and end dates) is required.",
    ),
    // .min(
    //   ref("votingStartTime"),
    //   "Voting end time must be after voting start time",
    // ),
  }),

  numAllowedEntrySubmissions: number()
    .positive("Invalid input")
    .integer("Invalid input")
    .typeError("Invalid input")
    .required(
      "Please specify the maximum number of entries allowed per participant.",
    ),
  maxTotalEntries: number()
    .positive("Invalid input")
    .integer("Invalid input")
    .typeError("Invalid input")
    .required(
      "Please specify the total number of entries allowed for the contest.",
    ),
});

type FormData = InferType<typeof createContestFormSchema>;

const CreateContentClient = () => {
  const { toast } = useToast();
  const router = useRouter();
  const {
    data: hash,
    isPending,
    isError: isWriteError,
    writeContract,
    error: writeError,
  } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
    isError: isConfirmError,
    data,
  } = useWaitForTransactionReceipt({
    hash,
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(createContestFormSchema),
  });

  const onSubmit = (data: FormData) => {
    writeContract({
      address: contractAddressContestFactory,
      abi: contestFactoryContractAbi,
      functionName: "createContest",
      args: [
        data?.title,
        data?.description,
        Math.round(data?.entryPeriod?.entryStartTime.getTime() / 1000),
        Math.round(data?.entryPeriod?.entryEndTime.getTime() / 1000),
        Math.round(data?.votingPeriod?.votingStartTime.getTime() / 1000),
        Math.round(data?.votingPeriod?.votingEndTime.getTime() / 1000),
        data?.numAllowedEntrySubmissions,
        data?.maxTotalEntries,
      ],
    });
  };

  useEffect(() => {
    if (isWriteError) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        // @ts-expect-error unknown error
        description:
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

  useEffect(() => {
    if (isConfirmed) {
      router.push(routes.contest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed]);

  console.log("data", data?.logs[0]?.address);

  return (
    <main className="pb-[100px] pt-5 text-white md:pt-[60px]">
      <PageWrapper>
        <HeadingWithArrow text="Create Contest" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mt-8 max-w-[599px] space-y-8"
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input
                placeholder="Give your contest a title"
                {...register("title")}
              />
              <FormErrorTextMessage errors={errors?.title} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ReactQuill theme="snow" value={value} onChange={onChange} />
                )}
              />
              <FormErrorTextMessage errors={errors?.description} />
            </div>

            <div className="flex flex-col gap-y-1">
              <Label htmlFor="entryPeriod">Entry Period</Label>
              <Controller
                name="entryPeriod"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="entryPeriod"
                        className={cn(
                          "h-[60px] w-full justify-start rounded-[8px] border border-white bg-[#332258] text-left font-normal text-white",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value?.entryStartTime ? (
                          value?.entryEndTime ? (
                            <>
                              {format(value?.entryStartTime, "LLL dd, y")} -{" "}
                              {format(value?.entryEndTime, "LLL dd, y")}
                            </>
                          ) : (
                            format(value?.entryStartTime, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick the entry period</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={value?.entryStartTime}
                        selected={{
                          from: value?.entryStartTime,
                          to: value?.entryEndTime,
                        }}
                        onSelect={(range) => {
                          onChange({
                            entryStartTime: range?.from,
                            entryEndTime: range?.to,
                          });
                        }}
                        numberOfMonths={2}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              <FormErrorTextMessage
                errors={errors?.entryPeriod?.entryStartTime}
              />
            </div>

            <div className="flex flex-col gap-y-1">
              <Label htmlFor="votingPeriod">Voting Period</Label>
              <Controller
                name="votingPeriod"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="votingPeriod"
                        className={cn(
                          "h-[60px] w-full justify-start rounded-[8px] border border-white bg-[#332258] text-left font-normal text-white",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value?.votingStartTime ? (
                          value?.votingEndTime ? (
                            <>
                              {format(value?.votingStartTime, "LLL dd, y")} -{" "}
                              {format(value?.votingEndTime, "LLL dd, y")}
                            </>
                          ) : (
                            format(value?.votingStartTime, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick the voting period</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={value?.votingStartTime}
                        selected={{
                          from: value?.votingStartTime,
                          to: value?.votingEndTime,
                        }}
                        onSelect={(range) => {
                          onChange({
                            votingStartTime: range?.from,
                            votingEndTime: range?.to,
                          });
                        }}
                        numberOfMonths={2}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              <FormErrorTextMessage
                errors={errors?.votingPeriod?.votingStartTime}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="numAllowedEntrySubmissions">
                Maximum Entries Per Participant
              </Label>
              <Input
                placeholder="Specify the number of entries allowed per participant"
                {...register("numAllowedEntrySubmissions")}
              />
              <FormErrorTextMessage
                errors={errors?.numAllowedEntrySubmissions}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="maxTotalEntries">Maximum Total Entries</Label>
              <Input
                placeholder="Specify the total number of entries allowed for the contest"
                {...register("maxTotalEntries")}
              />
              <FormErrorTextMessage errors={errors?.maxTotalEntries} />
            </div>
          </div>
          <Button disabled={isPending || isConfirming} className="w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isConfirming
              ? "Confirming transaction"
              : "Connect Wallet to submit"}
          </Button>
        </form>
      </PageWrapper>
    </main>
  );
};

export default CreateContentClient;
