"use client";

import NextImage from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ClothesDetail } from "@/type/clothesDetail";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Image } from "@nextui-org/image";

type Props = {
  clothes: ClothesDetail;
};

function ChevronDownIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        className="text-black dark:text-white"
      ></path>
    </svg>
  );
}

export default function ClothesCard({ clothes }: Props) {
  const [coverImage, setCoverImage] = useState<string>("pants");

  useEffect(() => {
    if (clothes.weight > 200) {
      setCoverImage("clothes");
    }
  }, [clothes.weight, clothes.transactionId, clothes.sensorId]);

  return (
    <Card className="w-fit p-4">
      <div className="flex items-baseline justify-between pl-4">
        <h4 className="text-large font-bold">衣架 {clothes.sensorId + 1}</h4>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light" isIconOnly>
              <ChevronDownIcon />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="選擇衣物標記"
            onAction={(target) => {
              setCoverImage(target.toString());
            }}
          >
            <DropdownSection title="選擇標記">
              <DropdownItem key="clothes">衣服</DropdownItem>
              <DropdownItem key="pants">褲子</DropdownItem>
              <DropdownItem key="jacket">外套</DropdownItem>
              <DropdownItem key="socks">襪子與其他</DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Link
        href={`/clothes/${clothes.transactionId}?sensorId=${clothes.sensorId}`}
      >
        <CardHeader className="flex-col items-start pb-0 pl-4 pt-2">
          <Divider className="mb-4" />
          <p className="text-default-500">
            等待時間：{clothes.prediction.toFixed(0)} 分鐘
          </p>
        </CardHeader>
        <CardBody>
          <Image
            as={NextImage}
            alt="Card background"
            className="h-[300px] w-[300px] rounded-xl object-cover"
            src={`/${coverImage}.png`}
            priority={true}
            width={200}
            height={200}
          />
        </CardBody>
      </Link>
    </Card>
  );
}
