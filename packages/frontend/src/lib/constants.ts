import contestAbi from "./Contest.sol/Contest.json";
import contestFactoryAbi from "./ContestFactory.sol/ContestFactory.json";

const contestContractAbi = contestAbi.abi;
const contestFactoryContractAbi = contestFactoryAbi.abi;

const contractAddressContestFactory =
  "0x700b6A60ce7EaaEA56F065753d8dcB9653dbAD35";

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
