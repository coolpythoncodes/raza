import { howvazaWorks, whyvaza } from "@/components/common/extras";
import HeadingWithArrow from "@/components/common/heading-with-arrow";
import { Icons } from "@/components/common/icons";
import PageWrapper from "@/components/common/page-wrapper";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import borderlesLogo from "@/public/borderless.svg";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import Contest from "./components/contest";

export default function HomePage() {
  return (
    <main className="text-white">
      <section className="bg-hero-bg bg-cover bg-no-repeat pb-[44px] pt-[60px]">
        <PageWrapper>
          <div className="flex flex-col items-center space-y-5">
            <div className="mx-auto max-w-[716px] space-y-3 text-center">
              <h1 className="text-4xl font-normal md:text-[44px] md:leading-[54px]">
                <span className="text-gradient">Decentralized Contests</span>,
                Fair Voting, Limitless Creativity
              </h1>
              <p className="text-sm font-normal md:text-lg md:leading-6">
                Create, Participate, and Vote in Transparent Contests Powered by
                Blockchain Technology
              </p>
            </div>
            <Link href={routes.createContest}>
              <Button className="w-[146px]">Create Contest</Button>
            </Link>
          </div>
        </PageWrapper>
      </section>

      {/* Partner */}
      <section className="relative flex h-[119px] items-center bg-partner-section-bg bg-center bg-no-repeat before:z-10 after:absolute after:left-0 after:top-0 after:h-full after:w-full after:bg-partner-section-gradient after:content-['']">
        <PageWrapper className="z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-y-1">
            <h3 className="text-center text-2xl font-normal leading-[38px] text-[#37265B]">
              Our Partner
            </h3>
            <Image
              src={borderlesLogo as StaticImageData}
              alt="borderless logo"
            />
          </div>
        </PageWrapper>
      </section>
      <div className="space-y-[60px] pt-[60px]">
        {/* Contest */}
        <Contest />
        {/* Why vaza */}
        <section>
          <PageWrapper>
            <HeadingWithArrow text="Why vaza" />
            <div className="grid grid-cols-1 gap-y-8 pt-10 md:pt-16 lg:grid-cols-3 lg:gap-x-5">
              {whyvaza?.map((item, index) => (
                <div
                  key={`why-vaza-${index}`}
                  className="space-y-2 text-center"
                >
                  <div className="flex items-center">
                    {index > 0 && (
                      <Icons.curvedDottedLine className="hidden w-10 lg:block" />
                    )}
                    <div className="flex-1">
                      <h4 className="text-2xl font-medium">{item?.title}</h4>
                      <p className="text-base font-normal">
                        {item?.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PageWrapper>
        </section>
        {/* How vaza Works */}
        <section className="pb-[100px]">
          <PageWrapper>
            <HeadingWithArrow text="How vaza Works" />
            <div className="grid grid-cols-1 gap-y-8 pt-10 md:pt-16 lg:grid-cols-3 lg:gap-x-5">
              {howvazaWorks.map((item, index) => (
                <div
                  key={`how-vaza-works-${index}`}
                  className="border-gradient flex transform flex-col items-center space-y-3 rounded-2xl py-6 pl-[31px] pr-8 text-center transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                >
                  {item?.icon}
                  <h4 className="text-xl font-medium md:text-[28px] md:leading-10">
                    {item?.title}
                  </h4>
                  <p className="text-base font-light md:text-base">
                    {item?.description}
                  </p>
                </div>
              ))}
            </div>
          </PageWrapper>
        </section>
      </div>
    </main>
  );
}
