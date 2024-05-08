import PastDataTable from "./PastDataTable";

type Props = {
  data: { transactionId: string; createdAt: Date | undefined }[];
};

export default function PastDataWrapper({ data }: Props) {
  return (
    <>
      <PastDataTable data={data} />
    </>
  );
}
