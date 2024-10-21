import EntryIdClient from "./entry-id-client";

const ParticipantEntryPage = ({
  params: { slug, entryId },
}: {
  params: { slug: `0x${string}`; entryId: string };
}) => {
  return <EntryIdClient {...{ slug, entryId }} />;
};

export default ParticipantEntryPage;
