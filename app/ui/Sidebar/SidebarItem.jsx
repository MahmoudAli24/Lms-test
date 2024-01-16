"use client";
import {usePathname} from "next/navigation";
import {motion} from "framer-motion";
import Link from "next/link";

export default function SidebarItem(props) {
    const path = usePathname();
    const classes = `block py-2 px-4 rounded-md hover:bg-[#000000] hover:text-white dark:hover:bg-[#2d2d2d] dark:border-[#2d2d2d] dark:text-[#e6f1fe] transition-colors transition-duration-500 ease-in-out`;
    const activeClasses = `block py-2 px-4 rounded-md bg-[#000000] text-white dark:bg-[#2d2d2d] dark:border-[#2d2d2d] dark:text-[#e6f1fe]`;
    const isActive = path === props.to;

    return (
        <li>
            <motion.div>
                <Link
                    className={isActive ? activeClasses : classes}
                    href={props.to}
                    initial={{
                        opacity: 0,
                        x: 100,
                        transition: {x: {stiffness: 1000, velocity: -100}},
                    }} // Initial position and opacity
                    animate={{opacity: 1, x: 0}} // Final position and opacity
                >{props.children}</Link>
            </motion.div>
        </li>
    );
}
