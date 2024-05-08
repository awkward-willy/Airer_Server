"use client";

import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";

type Props = {
  data: { transactionId: string; createdAt: Date | undefined }[];
};

export default function PastDataTable({ data }: Props) {
  return (
    <Table hideHeader aria-label="Past Data Table">
      <TableHeader>
        <TableColumn>建立時間</TableColumn>
      </TableHeader>
      <TableBody>
        {data.map(
          (data: { transactionId: string; createdAt: Date | undefined }) => (
            <TableRow key={data.transactionId}>
              <TableCell>
                <Link href={`/clothes/${data.transactionId}`}>
                  <p className="text-lg underline underline-offset-4">
                    {data.createdAt
                      ? new Date(data.createdAt).toLocaleString()
                      : ""}
                  </p>
                </Link>
              </TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
    </Table>
  );
}
