import { useEnsName } from "wagmi";
import truncateEthAddress from "truncate-eth-address";
import { cn } from "@/lib/utils";

type Props = {
  address: `0x${string}`;
  className?: string;
};

const UserAddress = ({ address, className }: Props) => {
  const { data } = useEnsName({
    address,
  });
  if (!address) return null;
  return (
    <p className={cn("text-base capitalize", className)}>
      {data ?? `${truncateEthAddress(address)}`}
    </p>
  );
};

export default UserAddress;
