import { useEnsName } from "wagmi";
import truncateEthAddress from "truncate-eth-address";

type Props = {
  address: `0x${string}`;
};

const UserAddress = ({ address }: Props) => {
  const { data } = useEnsName({
    address,
  });
  if (!address) return null;
  return (
    <p className="text-base capitalize">
      {data ?? `${truncateEthAddress(address)}`}
    </p>
  );
};

export default UserAddress;
