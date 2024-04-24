"use client";

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
import { Link } from "@nextui-org/react";

import { ThemeSwitcher } from "./ThemeSwitcher";

const menuItems = [
  { name: "首頁", href: "/" },
  { name: "介紹", href: "/intro" },
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
              <Link color="foreground" href={item.href}>
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
                color="foreground"
                className="w-full justify-center"
                href={item.href}
                size="lg"
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
