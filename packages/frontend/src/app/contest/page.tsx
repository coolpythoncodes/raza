import { type Metadata } from "next";
import ContestPageClient from "./components/contest-page-client";

export const metadata: Metadata = {
  title: "Create Contest",
  // description: 'Create and launch your own contest in minutes. Engage participants, collect entries, and manage voting seamlessly.'
};

const ContestPage = () => {
  return <ContestPageClient />;
};

export default ContestPage;
