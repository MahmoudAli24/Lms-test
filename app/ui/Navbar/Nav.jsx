"use client";
import {
  Button,
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
  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];
  return (
    <Navbar
      maxWidth='2xl'
      className='drop-shadow-lg dark:border-b-1 dark:border-indigo-400'
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className='sm:hidden'
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

          <Suspense fallback={<ThemeSwitcherSkeleton />}>
            <Button as={Link} color='primary' href='/dashboard' variant='flat'>
              Sign Up
            </Button>
          </Suspense>
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
              href='#'
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
