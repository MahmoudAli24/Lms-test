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
import {usePathname} from "next/navigation";
function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = ["Home", "Dashboard", "Students", "Classes" ,"Attendance" , "Edit Attendance"];
  const pathname = usePathname()
  return (
    <Navbar
      maxWidth='2xl'
      className='drop-shadow-lg dark:border-b-1 dark:border-indigo-400'
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className='tablet:hidden block'
        />
        <NavbarBrand>
          <h1 className='text-inherit text-2xl font-medium text-blue-500'>
            <Link href='/'>Student LMS</Link>
          </h1>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify='end'>
        <NavbarItem className='flex gap-3 items-center'>
          <Suspense fallback={<ThemeSwitcherSkeleton />}>
            <ThemeSwitcher />
          </Suspense>
          {pathname === "/" && <Link href='/dashboard'>Dashboard</Link>}
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
              onClick={() => setIsMenuOpen(false)}
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
                        : item === "Attendance"
                          ? "/dashboard/attendance"
                          : item === "Edit Attendance"
                            ? "/dashboard/edit-attendance"
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
