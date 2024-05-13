"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/navbar";
import { Tooltip } from "@nextui-org/tooltip";

import { ThemeSwitcher } from "./ThemeSwitcher";

const menuItems = [
  { name: "首頁", href: "/" },
  { name: "介紹", href: "/intro" },
  { name: "過往資料", href: "/pastdata" },
];

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isBordered>
      <NavbarContent>
        <NavbarBrand>
          <p className="font-bold text-inherit">智慧衣架</p>
        </NavbarBrand>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "關閉的選單" : "開啟的選單"}
          className="sm:hidden"
        />
      </NavbarContent>
      <NavbarContent className="hidden gap-6 sm:flex" justify="center">
        <>
          <ThemeSwitcher />
          {menuItems.map((item, index) => (
            <NavbarItem key={`${item}-${index}`}>
              <Link
                href={item.href}
                className="underline-offset-8 hover:underline"
              >
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </>
      </NavbarContent>
      <NavbarMenu>
        <>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="flex w-full justify-center underline-offset-8 hover:underline"
                href={item.href}
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
          <ThemeSwitcher />
        </>
      </NavbarMenu>
    </Navbar>
  );
}
