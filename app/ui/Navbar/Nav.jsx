"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import Link from "next/link";
import { ThemeSwitcher } from "../theme/ThemeSwitcher";
import { Suspense, useState } from "react";
import ThemeSwitcherSkeleton from "../theme/ThemeSwitcherSkeleton";
function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = ["Home", "Dashboard", "Students", "Classes"];
  return (
    <Navbar
      maxWidth='2xl'
      className='drop-shadow-lg dark:border-b-1 dark:border-indigo-400'
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className='tablet:hidden block'
        />
        <NavbarBrand>
          <h1 className='text-inherit text-2xl font-medium text-blue-500'>
            Student Lms
          </h1>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify='end'>
        <NavbarItem className='flex gap-3 items-center'>
          <Suspense fallback={<ThemeSwitcherSkeleton />}>
            <ThemeSwitcher />
          </Suspense>
          <Link href='/dashboard'>Dashboard</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
              }
              className='w-full'
              href={
                item === "Home"
                  ? "/"
                  : item === "Dashboard"
                    ? "/dashboard"
                    : item === "Students"
                      ? "/dashboard/students"
                      : item === "Classes"
                        ? "/dashboard/classes"
                        : "/"
              }
              size='md'
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

export default Nav;
