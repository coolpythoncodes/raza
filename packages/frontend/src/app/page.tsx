import { contests, howRazaWorks, whyRaza } from "@/components/common/extras";
import HeadingWithArrow from "@/components/common/heading-with-arrow";
import { Icons } from "@/components/common/icons";
import PageWrapper from "@/components/common/page-wrapper";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="text-white">
      <section className="pt-[60px] pb-[44px] bg-hero-bg bg-cover bg-no-repeat">
        <PageWrapper>
          <div className="space-y-5 flex flex-col items-center">
            <div className="space-y-3 text-center max-w-[716px] mx-auto">
              <h1 className="text-4xl md:text-[44px] font-normal md:leading-[54px]">
                <span className="text-gradient">Decentralized Contests</span>, Fair Voting, Limitless Creativity
              </h1>
              <p className="text-sm md:text-lg md:leading-6 font-normal">Create, Participate, and Vote in Transparent Contests Powered by Blockchain Technology</p>
            </div>
            <Link href={routes.createContest}><Button className="w-[146px]">Create Contest</Button></Link>
          </div>
        </PageWrapper>
      </section>
      <div className="space-y-[60px] pt-[60px]">
        {/* Contest */}
        <section>
          <PageWrapper>
            <HeadingWithArrow text="Contests" />
            <div className="grid grid-cols-1 gap-y-8 pt-10 md:pt-16 lg:grid-cols-3 lg:gap-x-5">
              {contests?.map((contest, index) => (
                <div
                  key={`contests-${index}`}
                  className="border-gradient transform space-y-5 p-7 font-normal transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                >
                  <div className="space-y-3">
                    <h4 className="line-clamp-1 text-[28px] leading-10">
                      {contest?.title}
                    </h4>
                    <div className="flex items-center gap-x-2">
                      <div className="h-7 w-7 rounded-full bg-[#D9D9D9]" />
                      <p className="text-base">{contest?.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-base text-[#D7C5FF]">
                      {contest?.duration}
                    </p>
                    <div className="space-y-1">
                      <p className="text-base">Tags:</p>
                      <div className="flex items-center gap-x-2">
                        {contest?.tags?.map((tag, index) => (
                          <div
                            key={`contest-tags-${index}`}
                            className="flex h-[30px] w-[88px] items-center justify-center rounded-[100px] bg-[#231443] p-2.5 text-xs leading-[18px]"
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={contest?.link}
                    className="border-gradient hover:bg-custom-gradient flex h-[60px] w-full items-center justify-center text-base font-normal"
                  >
                    View Contest
                  </Link>
                </div>
              ))}
            </div>
          </PageWrapper>
        </section>
        {/* Why Raza */}
        <section>
          <PageWrapper>
            <HeadingWithArrow text="Why Raza" />
            <div className="grid grid-cols-1 gap-y-8 pt-10 md:pt-16 lg:grid-cols-3 lg:gap-x-5">
              {whyRaza?.map((item, index) => (
                <div
                  key={`why-raza-${index}`}
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
        {/* How Raza Works */}
        <section className="pb-[100px]">
          <PageWrapper>
            <HeadingWithArrow text="How Raza Works" />
            <div className="grid grid-cols-1 gap-y-8 pt-10 md:pt-16 lg:grid-cols-3 lg:gap-x-5">
              {howRazaWorks.map((item, index) => (
                <div
                  key={`how-raza-works-${index}`}
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
