import { env } from "@/env";
import contestAbi from "./Contest.sol/Contest.json";
import contestFactoryAbi from "./ContestFactory.sol/ContestFactory.json";

const contestContractAbi = contestAbi.abi;
const contestFactoryContractAbi = contestFactoryAbi.abi;

const contractAddressContestFactory =
  env.NEXT_PUBLIC_ENVIRONMENT === "development"
    ? "0x700b6A60ce7EaaEA56F065753d8dcB9653dbAD35"
    : "0x1FE9Dcf5d7c36fDa5EA3F32a12Cb49F8a4b5A614";
// : "0x80C1fd53832D6A0693cDeb5d4Db601435AC6Eeca";

const wagmiContestFactoryContractConfig = {
  address: contractAddressContestFactory,
  abi: contestFactoryContractAbi,
} as const;

export {
  contestContractAbi,
  contestFactoryContractAbi,
  contractAddressContestFactory,
  wagmiContestFactoryContractConfig,
};
