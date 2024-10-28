/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import HeadingWithArrow from "@/components/common/heading-with-arrow";
import PageWrapper from "@/components/common/page-wrapper";
import { Button } from "@/components/ui/button";
import {
  contestFactoryContractAbi,
  contractAddressContestFactory,
} from "@/lib/constants";
import { routes } from "@/lib/routes";
import Link from "next/link";
import { useReadContract } from "wagmi";
import ContestItem from "../contest/components/contest-item";

const Contest = () => {
  const { data } = useReadContract({
    address: contractAddressContestFactory,
    abi: contestFactoryContractAbi,
    functionName: "getDeployedContests",
  });
  // @ts-expect-error unknown error
  return data?.length >= 3 ? (
    <section>
      <PageWrapper>
        <HeadingWithArrow text="Contests" />
        <div className="grid grid-cols-1 gap-y-8 pt-10 md:pt-16 lg:grid-cols-3 lg:gap-x-5">
          {data
            // @ts-expect-error unknown error
            ?.slice()
            ?.reverse()
            ?.slice(0, 3)
            //   @ts-expect-error unknown error
            ?.map((address, index) => (
              <ContestItem key={`contest-${index}`} address={address} />
            ))}
        </div>
        <div className="flex justify-center">
          <Link href={routes.contest}>
            <Button className="mt-8 w-[107px]">See more</Button>
          </Link>
        </div>
      </PageWrapper>
    </section>
  ) : null;
};

export default Contest;
