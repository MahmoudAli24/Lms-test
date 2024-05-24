"use client";
import {useState, Suspense, useEffect} from "react";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {logout} from "@/app/actions/actions";
import {
    Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle,
} from "@nextui-org/react";
import {ThemeSwitcher} from "../theme/ThemeSwitcher";
import ThemeSwitcherSkeleton from "../theme/ThemeSwitcherSkeleton";

function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {data: session} = useSession();
    const isLogin = session !== null

    function useWindowSize() {
        const [windowSize, setWindowSize] = useState({
            width: undefined, height: undefined,
        });

        useEffect(() => {
            function handleResize() {
                setWindowSize({
                    width: window.innerWidth, height: window.innerHeight,
                });
            }

            window.addEventListener('resize', handleResize);
            handleResize(); // Trigger once on mount

            return () => window.removeEventListener('resize', handleResize);
        }, []);

        return windowSize;
    }

    const {width} = useWindowSize();
    const isMobile = width < 768;

    const handleLogout = async () => {
        await logout();
        location.reload();
    };

    const menuItems = [{label: "Home", path: "/"}, {label: "Dashboard", path: "/dashboard"}, {
        label: "Students",
        path: "/dashboard/students"
    }, {label: "Classes", path: "/dashboard/classes"}, {
        label: "Attendance",
        path: "/dashboard/attendance"
    }, {label: "Edit Attendance", path: "/dashboard/edit-attendance"}, {
        label: "Exams",
        path: "/dashboard/exams"
    }, {label: "Add Exam", path: "/dashboard/add-exam"}, {
        label: "Edit Exam",
        path: "/dashboard/edit-exam"
    }, {label: "Add User", path: "/dashboard/addUser"}, {label: "Users", path: "/dashboard/users"},];

    return (<Navbar maxWidth="2xl" className="drop-shadow-lg dark:border-b-1 dark:border-indigo-400">
            <NavbarContent>
                <NavbarBrand>
                    <h1 className="text-inherit tablet:text-2xl text-lg text-blue-500">
                        <Link href="/">Student LMS</Link>
                    </h1>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem className="flex gap-2 mobile:gab-1 items-center">
                    <Suspense fallback={<ThemeSwitcherSkeleton/>}>
                        <ThemeSwitcher/>
                    </Suspense>
                    {isLogin && isMobile ? <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    /> : null}
                    {!isLogin && <Link href="/login">
                        <Button size="small" variant="shadow" color="primary" auto>Login</Button>
                    </Link>}
                    {isLogin && !isMobile &&
                        <div className="flex items-center justify-center gap-2"><Link href={"/dashboard"}>
                            Dashboard
                        </Link>
                            <Button size="small" variant="shadow" color={"danger"} auto onClick={handleLogout}>
                            Logout
                        </Button>

                        </div>}
                </NavbarItem>
            </NavbarContent>

            {isLogin && <NavbarMenu>
                {menuItems.map((item, index) => (<NavbarMenuItem key={`${item.label}-${index}`}>
                        <Link href={item.path} onClick={() => setIsMenuOpen(false)} className="w-full">
                            {item.label}
                        </Link>
                    </NavbarMenuItem>))}
                {isMobile &&
                    <Button size="small" variant="shadow" color={"danger"} fullWidth auto onClick={handleLogout}>
                        Logout
                    </Button>}
            </NavbarMenu>}
        </Navbar>);
}

export default Nav;
