/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import {
  contestFactoryContractAbi,
  contractAddressContestFactory,
} from "@/lib/constants";
import { useReadContract } from "wagmi";
import ContestItem from "./contest-item";
import PageWrapper from "@/components/common/page-wrapper";
import Loader from "@/components/common/loader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Icons } from "@/components/common/icons";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

const ContestPageClient = () => {
  const { data, isPending, isError } = useReadContract({
    address: contractAddressContestFactory,
    abi: contestFactoryContractAbi,
    functionName: "getDeployedContests",
  });

  if (isPending) return <Loader />;

  if (!isPending && isError) {
    redirect("/");
  }
  return (
    <main className="pt-[55px]">
      <PageWrapper>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/"
                  className="text-sm font-normal leading-[21px] text-[#FFFFFFB2] hover:!text-[#BB8FFF]"
                >
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-normal leading-[21px] text-white">
                Contest
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* @ts-expect-error unknown error */}
        {data?.length ? (
          <div className="mt-[21px] grid grid-cols-1 gap-y-8 lg:grid-cols-3 lg:gap-x-5">
            {/* @ts-expect-error unknown error */}
            {data?.map((address, index) => (
              <ContestItem
                key={`deployed-contest-${index}`}
                address={address}
              />
            ))}
          </div>
        ) : (
          <div className="border-gradient mx-auto mt-[41px] flex max-w-[360px] flex-col items-center gap-y-2 py-6 text-white">
            <Icons.infoEmpty />
            <p className="text-xl font-normal leading-8">
              Nothing contest here
            </p>
            <Link href={routes.createContest}>
              {" "}
              <Button className="h-10">Create contest</Button>
            </Link>
          </div>
        )}
      </PageWrapper>
    </main>
  );
};

export default ContestPageClient;
