"use client";

import NextImage from "next/image";
import Link from "next/link";

import { Clothes } from "@/type/clothes";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Image } from "@nextui-org/image";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";

type Props = {
  clothes: Clothes;
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
      ></path>
    </svg>
  );
}

export default function ClothesCard({ clothes }: Props) {
  return (
    <Card className="py-4">
      <div className="flex items-center justify-between px-4">
        <h4 className="text-large font-bold">衣服1</h4>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light" isIconOnly>
              <ChevronDownIcon />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="">
            <DropdownSection title="選擇標記">
              <DropdownItem key="new">衣服</DropdownItem>
              <DropdownItem key="copy">褲子</DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Link href={`/clothes/${clothes.id}`}>
        <CardHeader className="flex-col items-start px-4 pb-0 pt-2">
          <Divider className="my-1" />
          <small className="text-default-500">等待時間：{clothes.time}</small>
        </CardHeader>
        <CardBody>
          <Image
            as={NextImage}
            alt="Card background"
            className="h-auto w-auto rounded-xl object-cover"
            src="/pants.png"
            priority={true}
            width={300}
            height={300}
          />
        </CardBody>
      </Link>
    </Card>
  );
}
