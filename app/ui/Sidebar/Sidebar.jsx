"use client";
import { motion } from "framer-motion";
import SidebarItem from "./sidebarItem";

export default function SideBar() {
  const menuItems = ["Dashboard", "Team-Settings", "Help-Feedback", "LogOut"];
  return (
    <motion.div
      className='w-[250px] h-screen p-3 bg-[#F0FCFF] dark:bg-[#18181b] border-r-1 border-indigo-500'
      initial={{ x: -250 }} // Initial position off-screen
      animate={{ x: 0 }} // Move to the center of the screen
      transition={{ duration: 0.5, type: "spring", stiffness: 70 }}
    >
      <motion.ul
        transition={{ staggerChildren: 0.07, delayChildren: 0.2 }}
        className='space-y-3'
      >
        {menuItems.map((item, index) => (
          <SidebarItem key={`${item}-${index}`} to={`/${item.toLowerCase()}`}>
            {item}
          </SidebarItem>
        ))}
      </motion.ul>
    </motion.div>
  );
}
