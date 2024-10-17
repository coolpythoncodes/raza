/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useDisclosure from "@/hooks/use-disclosure.hook";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { type InferType, object, string } from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { contestContractAbi } from "@/lib/constants";
import FormErrorTextMessage from "@/components/common/form-error-text-message";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

type Props = {
  address: `0x${string}`;
};

const createEntryFormSchema = object({
  content: string().required("Entry is required"),
});

type FormData = InferType<typeof createEntryFormSchema>;

const SubmitEntry = ({ address }: Props) => {
  const { isOpen, onClose, onToggle } = useDisclosure();

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
  } = useWaitForTransactionReceipt({
    hash,
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(createEntryFormSchema),
  });

  const onSubmit = (data: FormData) => {
    writeContract({
      address,
      abi: contestContractAbi,
      functionName: "submitEntry",
      args: [data?.content],
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
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed]);
  console.log("writeError", writeError);
  console.log("isConfirmError", isConfirmError);
  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>
        <Button className="h-[30px] rounded-[100px] border border-white bg-[#1F0061] text-xs font-normal leading-[18px] md:w-[106px]">
          Submit entry
        </Button>
      </DialogTrigger>
      <DialogContent className="text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-normal leading-8">
            Submit Entry
          </DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5">
            <div className="space-y-1">
              <Controller
                name="content"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ReactQuill theme="snow" value={value} onChange={onChange} />
                )}
              />
              <FormErrorTextMessage errors={errors?.content} />
            </div>
            <Button
              disabled={isPending || isConfirming}
              className="h-[44px] w-full"
            >
              {isPending ||
                (isConfirming && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ))}
              {isConfirming ? "Confirming transaction" : "Submit Entry"}
            </Button>
          </form>
          {/* <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription> */}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitEntry;
