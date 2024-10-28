import React from "react";
import { Icons } from "./icons";
import { routes } from "@/lib/routes";
import Link from "next/link";
import { Button } from "../ui/button";

const NoContest = () => {
  return (
    <div className="border-gradient mx-auto mt-[41px] flex max-w-[360px] flex-col items-center gap-y-2 py-6 text-white">
      <Icons.infoEmpty />
      <p className="text-xl font-normal leading-8">No contest here</p>
      <Link href={routes.createContest}>
        <Button className="h-10">Create contest</Button>
      </Link>
    </div>
  );
};

export default NoContest;
