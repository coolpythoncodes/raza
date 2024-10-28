/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import FormErrorTextMessage from "@/components/common/form-error-text-message";
import HeadingWithArrow from "@/components/common/heading-with-arrow";
import PageWrapper from "@/components/common/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  contestFactoryContractAbi,
  contractAddressContestFactory,
} from "@/lib/constants";
import { routes } from "@/lib/routes";
import { reactQuillFormat, reactQuillModules } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker, type GetProps } from "antd";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { date, number, object, string, type InferType } from "yup";

const { RangePicker } = DatePicker;

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
      .test(
        "isAfter",
        "Entry end time must be strictly after entry start time",
        function (endTime) {
          const startTime = this.parent.entryStartTime;
          if (!startTime || !endTime) return true; // Skip validation if either date is missing
          return endTime > startTime; // Ensures end time is strictly after start time
        },
      ),
  }),

  votingPeriod: object({
    votingStartTime: date()
      .required("The voting period (start and end dates) is required.")
      .test(
        "isAfterEntryEnd",
        "Voting start time must be strictly after entry end time",
        function (votingStart) {
          const entryEnd = this.parent.entryPeriod?.entryEndTime;
          if (!entryEnd || !votingStart) return true;
          return votingStart > entryEnd;
        },
      ),
    votingEndTime: date()
      .required("The voting period (start and end dates) is required.")
      .test(
        "isAfterVotingStart",
        "Voting end time must be strictly after voting start time",
        function (votingEnd) {
          const votingStart = this.parent.votingStartTime;
          if (!votingStart || !votingEnd) return true;
          return votingEnd > votingStart;
        },
      )
      .test(
        "isAfterEntryPeriod",
        "Voting end time must be strictly after entry period",
        function (votingEnd) {
          const entryEnd = this.parent.entryPeriod?.entryEndTime;
          const entryStart = this.parent.entryPeriod?.entryStartTime;
          if (!entryEnd || !entryStart || !votingEnd) return true;
          return votingEnd > entryEnd && votingEnd > entryStart;
        },
      ),
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
    )
    .when("numberOfWinners", (numberOfWinners, schema) =>
      // @ts-expect-error unknown error
      schema.moreThan(
        numberOfWinners,
        "Maximum Total Entries must be strictly greater than number of winners",
      ),
    ),
  numberOfWinners: number()
    .positive("Invalid input")
    .integer("Invalid input")
    .typeError("Invalid input")
    .required(
      "Please specify the total number of winners allowed for the contest.",
    ),
});

type FormData = InferType<typeof createContestFormSchema>;
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

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
    // data,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // Can not select days before today
    return current && current < dayjs().startOf("day");
  };

  const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const disabledRangeTime: RangePickerProps["disabledTime"] = (
    current,
    type,
  ) => {
    if (!current) return {};

    const now = new Date();
    const isToday = current.isSame(now, "day");

    if (!isToday) {
      return {}; // Don't disable any times for future dates
    }
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    if (type === "start") {
      return {
        disabledHours: () => range(0, currentHour),
        disabledMinutes: () =>
          current.hour() === now.getHours() ? range(0, currentMinute) : [],
        disabledSeconds: () => {
          if (
            current.hour() === now.getHours() &&
            current.minute() === now.getMinutes()
          ) {
            return range(0, currentSecond);
          }
          return [];
        },
      };
    }

    // For end time, only disable minutes and seconds when we're in the current hour
    return {
      disabledHours: () => range(0, currentHour),
      disabledMinutes: () =>
        current.hour() === now.getHours() ? range(0, currentMinute) : [],
      disabledSeconds: () => {
        if (
          current.hour() === now.getHours() &&
          current.minute() === now.getMinutes()
        ) {
          return range(0, currentSecond);
        }
        return [];
      },
    };
  };

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
        // Math.round(new Date().getTime() / 1000) + 100,
        // Math.round(new Date().getTime() / 1000) + 1000,
        // Math.round(new Date().getTime() / 1000) + 2000,
        // Math.round(new Date().getTime() / 1000) + 3000,
        Math.round(data?.entryPeriod?.entryStartTime.getTime() / 1000),
        Math.round(data?.entryPeriod?.entryEndTime.getTime() / 1000),
        Math.round(data?.votingPeriod?.votingStartTime.getTime() / 1000),
        Math.round(data?.votingPeriod?.votingEndTime.getTime() / 1000),
        data?.numAllowedEntrySubmissions,
        data?.maxTotalEntries,
        data?.numberOfWinners,
      ],
    });
  };

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

  useEffect(() => {
    if (isConfirmed) {
      router.push(routes.contest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed]);

  return (
    <main className="pb-[100px] pt-5 !text-white md:pt-[60px]">
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
                  <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={reactQuillModules}
                    formats={reactQuillFormat}
                  />
                )}
              />
              <FormErrorTextMessage errors={errors?.description} />
            </div>

            <div className="flex flex-col gap-y-1">
              <Label htmlFor="entryPeriod">Entry Period</Label>
              <Controller
                name="entryPeriod"
                control={control}
                render={({ field: { onChange } }) => (
                  <RangePicker
                    showTime
                    onChange={(range) => {
                      onChange({
                        // @ts-expect-error unknown error
                        entryStartTime: range?.[0]?.$d,
                        // @ts-expect-error unknown error
                        entryEndTime: range?.[1]?.$d,
                      });
                    }}
                    disabledDate={disabledDate}
                    disabledTime={disabledRangeTime}
                    className="!h-[60px] !bg-[#332258] !text-white placeholder:!text-white"
                  />
                )}
              />
              <FormErrorTextMessage
                errors={
                  errors?.entryPeriod?.entryStartTime ??
                  errors?.entryPeriod?.entryEndTime
                }
              />
            </div>

            <div className="flex flex-col gap-y-1">
              <Label htmlFor="votingPeriod">Voting Period</Label>
              <Controller
                name="votingPeriod"
                control={control}
                render={({ field: { onChange } }) => (
                  <RangePicker
                    showTime
                    onChange={(range) => {
                      onChange({
                        // @ts-expect-error unknown error
                        votingStartTime: range?.[0]?.$d,
                        // @ts-expect-error unknown error
                        votingEndTime: range?.[1]?.$d,
                      });
                    }}
                    disabledDate={disabledDate}
                    disabledTime={disabledRangeTime}
                    className="!h-[60px] !bg-[#332258] !text-white placeholder:!text-white"
                  />
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
            <div className="space-y-1">
              <Label htmlFor="numberOfWinners">Number of Winners</Label>
              <Input
                placeholder="Specify the number of winners allowed for the contest"
                {...register("numberOfWinners")}
              />
              <FormErrorTextMessage errors={errors?.numberOfWinners} />
            </div>
          </div>
          <Button disabled={isPending || isConfirming} className="w-full">
            {isPending ||
              (isConfirming && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ))}
            {isConfirming ? "Confirming transaction" : "Submit"}
          </Button>
        </form>
      </PageWrapper>
    </main>
  );
};

export default CreateContentClient;
