import PageWrapper from "@/components/common/page-wrapper";

type Props = {
  slug: `0x${string}`;
};
const ContestPageByAddressClient = ({ slug }: Props) => {
  console.log("slug", slug);
  return (
    <main>
      <PageWrapper>ContestPageByAddressClient</PageWrapper>
    </main>
  );
};

export default ContestPageByAddressClient;
