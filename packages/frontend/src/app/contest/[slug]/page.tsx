import ContestPageByAddressClient from "./components/contest-page-by-address-client";

const ContestPageByAddress = ({
  params: { slug },
}: {
  params: { slug: `0x${string}` };
}) => {
  return <ContestPageByAddressClient {...{ slug }} />;
};

export default ContestPageByAddress;
