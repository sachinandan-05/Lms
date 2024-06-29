'use client'
import React from "react"
import { FC, useState } from "react"
import Link from "next/link"
import NavItems from "../utils/NavItems";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import { HiMenuAlt3 } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: number

}

const Header: FC<Props> = ({ setOpen, activeItem }) => {
    const [active, setActive] = useState(false);
    const [openSideBar, setOpenSideBar] = useState(false);
    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 85) {
                setActive(true);
            } else {
                setActive(false);
            }
        })

    }

    const handleClose = (e: any) => {
        setOpenSideBar(!e)

    }
    return (
        <div className="w-full relative">
            <div className={`${active ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl trasition duration-500 "
                : "w-full border-b  dark:border-[#ffffff1c] h-[80px] z-[80]  dark:shadow"}  `}>
                <div className="w-[95%] md:w-[92%] m-auto py-2 h-full">
                    <div className="w-full h-[80px] flex items-center justify-between p-3">
                        <div >
                            <Link href={"/"}
                                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}>
                                ELearning
                            </Link>
                        </div>
                        <div className="flex  items-center">
                            <NavItems activeItem={activeItem} isMobile={false} />

                            <ThemeSwitcher />

                            <div className="hidden md:block">
                                <FaUserCircle size={25} className="dark:text-white text-black ml-3" />
                            </div>

                            {/* only for mobile */}
                            <div className="md:hidden block ">
                                <HiMenuAlt3 size={25} className="dark:text-white text-black "
                                    onClick={() => setOpenSideBar(true)} />

                            </div>

                        </div>
                        {/* mobile sidebar */}
                        {
                            openSideBar && (
                                <div className="fixed w-full top-0 left-0 z-[99999] dark:bg-[unset] bg-[#e1606024]" id="screen"
                                    onClick={handleClose}>
                                    <div className="w-[70%] fixed z-[999999] h-screen bg-white dark:bg-slate-900 top-0 right-0 dark:bg-opacity-90 shadow-sm drop-shadow-sm shadow-slate-500">
                                        
                                        <NavItems  activeItem={activeItem} isMobile={true} />
                                        <div className=" text-center ">
                                            <FaUserCircle size={30} className="dark:text-white text-black ml-6" />
                                        </div>
                                        <p className="text-[16px] px-2 pl-5 text-black dark:text-white">copyright@ 2024 Elearning</p>
                                    </div>
                                </div>
                            )
                        }

                    </div>


                </div>

            </div>

        </div>
    )
}
export default Header;
