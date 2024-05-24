"use client";
import { motion } from "framer-motion";
import SidebarItem from "./SidebarItem";

const menuItems = {
    Dashboard: "/dashboard",
    Students: "/dashboard/students",
    Classes: "/dashboard/classes",
    Attendance: "/dashboard/attendance",
    "Edit Attendance": "/dashboard/edit-attendance",
    Exams: "/dashboard/exams",
    "Add Exam": "/dashboard/add-exam",
    "Edit Exam": "/dashboard/edit-exam",
    "Add User": "/dashboard/addUser",
    "Users": "/dashboard/users",
};

export default function SideBar() {
    return (
        <motion.div
            className="w-[250px] h-[calc(100vh-64px)] p-3 bg-[#f5f7f9] dark:bg-[#18181b] tablet:block hidden fixed top-16 left-0 z-10"
            initial={{ x: -250 }} // Initial position off-screen
            animate={{ x: 0 }} // Move to the center of the screen
            transition={{ duration: 0.5, type: "spring", stiffness: 70 }}
        >
            <motion.ul
                transition={{ staggerChildren: 0.07, delayChildren: 0.2 }}
                className="space-y-3"
            >
                {Object.entries(menuItems).map(([item, route]) => (
                    <SidebarItem key={item} to={route}>
                        {item}
                    </SidebarItem>
                ))}
            </motion.ul>
        </motion.div>
    );
}
