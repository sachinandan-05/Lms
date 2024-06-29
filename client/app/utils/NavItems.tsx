'use client'
import Link from 'next/link';
import React from 'react';

export const navItemsData = [
    {
        name: "Home",
        url: "/"
    },
    {
        name: "Courses",
        url: "/courses"
    },
    {
        name: "About",
        url: "/about"
    },
    {
        name: "Policy",
        url: "/policy"
    },
    {
        name: "FAQ",
        url: "/faq"
    }
];

type Props = {
    activeItem: number,
    isMobile: boolean
}

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {
    return (
        <>
            <div className="hidden md:flex">
                {
                    navItemsData && navItemsData.map((i, index) => (
                        <Link href={i.url} key={index} passHref>
                            <span
                                className={`${activeItem === index
                                    ? "dark:text-[#37a39a] text-[crimson]"
                                    : "dark:text-white text-black"
                                    } text-[18px] font-Poppins p-6`}>
                                {i.name}
                            </span>
                        </Link>
                    ))
                }
            </div>
            {
                isMobile && (
                    <div className='md:hidden mt-4'>
                        <div className='w-full  py-6'>
                        <div className='text-center' >
                            <Link href={"/"}
                                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}>
                                ELearning
                            </Link>
                        </div>
                            {
                                
                                navItemsData && navItemsData.map((i, index) => (
                                    <Link href={i.url} passHref key={index}>
                                        <span
                                            className={`${activeItem === index
                                                ? "dark:text-[#37a39a] text-[crimson]"
                                                : "dark:text-white text-black"
                                                } block py-5 text-[18px] font-Poppins px-6 font-[400]`}>
                                            {i.name}
                                        </span>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default NavItems;
