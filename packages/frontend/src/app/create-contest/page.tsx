import { type Metadata } from "next";
import CreateContentClient from "./components/create-content-client";

export const metadata: Metadata = {
  title: "Create Contest",
  description:
    "Create and launch your own contest in minutes. Engage participants, collect entries, and manage voting seamlessly.",
};
const ContestPage = () => {
  return <CreateContentClient />;
};

export default ContestPage;
