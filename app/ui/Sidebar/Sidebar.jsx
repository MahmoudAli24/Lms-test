"use client";
import {motion} from "framer-motion";
import SidebarItem from "./SidebarItem";

export default function SideBar() {
    const menuItems = ["Dashboard", "Students", "Classes", "Attendance", "Edit Attendance"];
    return (
        <motion.div
            className='w-[250px] h-[calc(100vh-64px)] p-3 bg-[#F5F7F9] dark:bg-[#18181b] tablet:block hidden'
            initial={{x: -250}} // Initial position off-screen
            animate={{x: 0}} // Move to the center of the screen
            transition={{duration: 0.5, type: "spring", stiffness: 70}}
        >
            <motion.ul
                transition={{staggerChildren: 0.07, delayChildren: 0.2}}
                className='space-y-3'
            >
                {menuItems.map((item, index) => (
                    <SidebarItem
                        key={`${item}-${index}`}
                        to={
                            item === "Dashboard"
                                ? "/dashboard"
                                : item === "Students"
                                    ? "/dashboard/students"
                                    : item === "Classes"
                                        ? "/dashboard/classes"
                                        : item === "Attendance"
                                            ? "/dashboard/attendance"
                                            : item === "Edit Attendance"
                                                ? "/dashboard/edit-attendance"
                                                : null
                        }
                    >
                        {item}
                    </SidebarItem>
                ))}
            </motion.ul>
        </motion.div>
    );
}
