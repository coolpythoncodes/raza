/* eslint-disable @typescript-eslint/no-floating-promises */
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import truncateEthAddress from "truncate-eth-address";
import { useEnsName } from "wagmi";

type Props = {
  address: `0x${string}`;
  className?: string;
};

const UserAddress = ({ address, className }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const { data } = useEnsName({
    address,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(address).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  useEffect(() => {
    if (isCopied) {
      toast({
        title: "Copied to clipboard",
        description: address,
      });
    }
  }, [address, isCopied]);

  if (!address) return null;

  return (
    <div className="flex items-center gap-x-3">
      <p className={cn("text-base capitalize", className)}>
        {data ?? `${truncateEthAddress(address)}`}
      </p>
      <button onClick={handleCopy}>
        <Copy className="h-3 w-3" />
      </button>
    </div>
  );
};

export default UserAddress;
