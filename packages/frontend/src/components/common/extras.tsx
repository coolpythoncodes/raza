import { routes } from "@/lib/routes";
import { Icons } from "./icons";

export const navLinks = [
  {
    name: "Home",
    link: routes.home,
  },
  {
    name: "Contest",
    link: routes.contest,
  },
  {
    name: "Create Contest",
    link: routes.createContest,
  },
];

export const whyRaza = [
  {
    title: "Transparent & Fair Competitions",
    description:
      "At Rasa, every contest is powered by blockchain technology, ensuring transparency and fairness at every stage. Smart contracts govern the rules, so there’s no room for manipulation or bias.",
  },
  {
    title: "Decentralized Voting",
    description:
      "Our platform uses token-based voting mechanisms to empower the community. Whether you're a creator, participant, or voter, your voice matters, and the process is secure and verifiable.",
  },
  {
    title: "Global Community",
    description:
      "Join a growing community of creators, voters, and influencers who are passionate about innovation and creativity. Build your reputation, grow your audience, and be part of something bigger.",
  },
];

export const howRazaWorks = [
  {
    icon: <Icons.vote />,
    title: "Create a Contest",
    description:
      "Set up your contest by specifying details like the title, category, submission period, and voting period. You can also define eligibility requirements and prize distribution. Once you're ready, Rasa automatically generates a smart contract to manage the contest.",
  },
  {
    icon: <Icons.tokenOutline />,
    title: "Vote with Tokens",
    description:
      "When the submission period closes, the voting begins. Eligible voters can use their tokens or NFTs to vote for their favorite entries. The voting process is transparent and protected against fraud using blockchain's immutable ledger.",
  },
  {
    icon: <Icons.pollResult />,
    title: "Transparent Results",
    description:
      "Once voting ends, results are automatically calculated and published. Winners are announced, and prizes are distributed via smart contracts—no delays, no intermediaries, just instant, secure payouts.",
  },
];
